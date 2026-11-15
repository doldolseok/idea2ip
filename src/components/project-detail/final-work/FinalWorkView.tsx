import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import StatusMessage from '../../StatusMessage';
import { Panel, PanelTitle, SoftButton } from './finalWork.styles';
import { SubmitButton, TextArea, TextInput } from '../../modal/modalForm.styles';
import { useImageFileInput } from '../../../hooks/useImageFileInput';
import { getWorkTypeSummary } from '../../../constants/workTypes';
import { useProjectStore } from '../../../store/projectStore';
import type { FinalWork, Project } from '../../../types/project';
import { colors, media } from '../../../styles/theme';
import type { ArtworkImageResult } from '../../../api/artwork';
import { deleteArtwork, updateArtwork } from '../../../api/artwork';
import type { UpdateArtworkInput } from '../../../api/artwork';

interface Props {
  project: Project;
  finalWork: FinalWork;
  showAlert: (message: string) => void;
  onGoToInterview: () => void;
  onUpload: (file: File) => Promise<ArtworkImageResult>;
  uploading: boolean;
  imageUrl?: string;
  /** 서버 이미지를 불러오는 중 / 오류 안내 (미리보기 칸 안에 표시) */
  imageStatus?: ReactNode;
}

// 최종 작품 탭 2번 상태: 저장한 최종 작품 (작품 교체 / 설명 수정)

export default function FinalWorkView({
  project,
  finalWork,
  showAlert,
  onGoToInterview,
  onUpload,
  uploading,
  imageUrl,
  imageStatus,
}: Props) {
  const saveFinalWork = useProjectStore((state) => state.saveFinalWork);
  const save = (changes: Partial<FinalWork>) =>
    saveFinalWork(project.id, { ...finalWork, ...useProjectStore.getState().finalWorkByProjectId[project.id], ...changes, updatedAt: new Date().toISOString() });

  // 작품 교체: 파일 선택 창 → 형식 검사 → 이미지 교체
  const { openPicker, fileInput } = useImageFileInput({
    onSelect: async (file) => {
      if (uploading || saveLock.current || deleteLock.current) return;
      try {
        const result = await onUpload(file);
        if (finalWork.imageUrl.startsWith('blob:')) URL.revokeObjectURL(finalWork.imageUrl);
        save({ imageUrl: '', imageName: result.fileName });
      } catch {
        // 실패하면 기존 작품을 유지합니다. 오류 안내는 탭에서 처리합니다.
      }
    },
    onInvalid: () => showAlert('지원하지 않는 이미지 형식입니다.'),
  });

  // 제목과 설명을 편집한 뒤 명시적으로 저장합니다.
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(finalWork.description);
  const [draftTitle, setDraftTitle] = useState(finalWork.title ?? '');
  const [saving, setSaving] = useState(false);
  const saveLock = useRef(false);
  const deleteLock = useRef(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const handleDelete = async () => {
    if (deleteLock.current || saveLock.current || uploading) return;
    if (!window.confirm('최종 작품을 삭제할까요? 작품 정보와 저장된 이미지가 함께 삭제됩니다.')) return;
    deleteLock.current = true;
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteArtwork(project.id);
      if (finalWork.imageUrl.startsWith('blob:')) URL.revokeObjectURL(finalWork.imageUrl);
      useProjectStore.setState((state) => {
        const next = { ...state.finalWorkByProjectId };
        delete next[project.id];
        return { finalWorkByProjectId: next };
      });
      showAlert('최종 작품을 삭제했습니다.');
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : '최종 작품을 삭제하지 못했습니다.');
    } finally {
      deleteLock.current = false;
      setDeleting(false);
    }
  };
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing) descriptionRef.current?.focus();
  }, [isEditing]);

  const commitDescription = async () => {
    if (saveLock.current || deleteLock.current || uploading) return;
    if (!draftTitle.trim()) {
      showAlert('최종 작품 제목을 입력해주세요.');
      return;
    }
    const changes: UpdateArtworkInput = {};
    if (draftTitle.trim() !== finalWork.title) changes.title = draftTitle.trim();
    if (draft.trim() !== finalWork.description) changes.description = draft.trim() || null;
    if (!Object.keys(changes).length) { setIsEditing(false); return; }
    saveLock.current = true;
    setSaving(true);
    try {
      const result = await updateArtwork(project.id, changes);
      if (finalWork.artworkId && result.artworkId !== finalWork.artworkId) throw new Error('수정 응답의 작품 ID가 일치하지 않습니다.');
      save({ artworkId: result.artworkId, title: result.title, description: result.description ?? '', imageName: result.fileName ?? '' });
      setIsEditing(false);
      showAlert('작품 정보를 수정했습니다.');
    } catch (error) {
      showAlert(error instanceof Error ? error.message : '작품을 수정하지 못했습니다.');
    } finally {
      saveLock.current = false;
      setSaving(false);
    }
  };

  const toggleEditing = () => {
    if (isEditing) {
      commitDescription();
      return;
    }
    setDraft(finalWork.description);
    setDraftTitle(finalWork.title ?? '');
    setIsEditing(true);
  };

  return (
    <>
      <ImagePanel $ratio={492}>
        <PanelTitle>등록된 최종 작품</PanelTitle>
        <ImageBody>
          <PreviewBox>
            {imageStatus ?? (!imageUrl && !finalWork.imageUrl && <EmptyText>아래 작품 교체 버튼에서 이미지를 추가할 수 있습니다.</EmptyText>)}
            {!imageStatus && (imageUrl || finalWork.imageUrl) && <img src={imageUrl || finalWork.imageUrl} alt={`${project.title} 최종 작품`} />}
          </PreviewBox>
          <SoftButton type="button" onClick={openPicker} disabled={uploading || saving || deleting}>
            {uploading ? '저장 중…' : '작품 교체'}
          </SoftButton>
          {fileInput}
        </ImageBody>
      </ImagePanel>

      <DescriptionPanel $ratio={536}>
        <DescriptionBody>
          <DescriptionBlock>
            <DescriptionTitle as="label" htmlFor="final-work-saved-title">최종 작품 제목</DescriptionTitle>
            <TextInput id="final-work-saved-title" readOnly={!isEditing || saving || deleting} value={isEditing ? draftTitle : finalWork.title ?? ''} onChange={(event) => setDraftTitle(event.target.value)} />
          </DescriptionBlock>
          <DescriptionBlock>
            <DescriptionTitle as="label" htmlFor="final-work-saved-description">
              최종 작품 설명
            </DescriptionTitle>
            <Description
              ref={descriptionRef}
              id="final-work-saved-description"
              readOnly={!isEditing || saving || deleting}
              value={isEditing ? draft : finalWork.description}
              onChange={(e) => setDraft(e.target.value)}
            />
          </DescriptionBlock>
          <Summary>
            <span>프로젝트 · {project.title}</span>
            <span>저작물 유형 · {getWorkTypeSummary(project.workType)}</span>
          </Summary>
        </DescriptionBody>

        <Footer>
          {deleteError && <StatusMessage role="alert" message={deleteError} />}
          <Actions>
            {/* 디자인의 "설명 수정" 자리: 제목·설명 수정, 수정 중 취소, 삭제(디자인에 없음)를 같은 보조 버튼으로 나란히 */}
            <LeftActions>
              <SoftButton
                type="button"
                // 편집 중 버튼을 눌러도 칸이 먼저 blur 되지 않게 (클릭에서 한 번만 저장)
                onMouseDown={(e) => e.preventDefault()}
                onClick={toggleEditing}
                disabled={saving || uploading || deleting}
              >
                {saving ? '저장 중…' : isEditing ? '변경 저장' : '작품 정보 수정'}
              </SoftButton>
              {isEditing ? (
                <SoftButton type="button" disabled={saving} onClick={() => setIsEditing(false)}>취소</SoftButton>
              ) : (
                <DeleteButton type="button" onClick={handleDelete} disabled={deleting || saving || uploading}>
                  {deleting ? '삭제 중…' : '작품 삭제'}
                </DeleteButton>
              )}
            </LeftActions>
            <InterviewButton type="button" onClick={onGoToInterview} disabled={deleting}>
              AI 인터뷰 준비 확인
            </InterviewButton>
          </Actions>
        </Footer>
      </DescriptionPanel>
    </>
  );
}

const ImagePanel = styled(Panel)`
  gap: 24px;
  padding-bottom: 8px;
`;

const ImageBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 18px;
  padding-bottom: 8px;
`;

const PreviewBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 284px;
  overflow: hidden;
  background: ${colors.softBlueBg};
  border: 1px solid ${colors.cardBorder};
  border-radius: 12px;

  img {
    display: block;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

/* Figma: 내용과 버튼 사이 최소 107px, 버튼은 카드 아래쪽 */
const DescriptionPanel = styled(Panel)`
  justify-content: space-between;
  gap: 107px;
  padding-bottom: 8px;

  ${media.tablet} {
    gap: 32px;
  }
`;

const DescriptionBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const DescriptionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const DescriptionTitle = styled(PanelTitle)`
  color: #000;
`;

const Description = styled(TextArea)`
  height: 121px;
  color: ${colors.muted};

  &:read-only {
    cursor: default;
  }

  &:read-only:focus {
    border-color: ${colors.border};
  }
`;

const Summary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px;
  color: ${colors.textHint};
  font-size: 10px;
  line-height: 14px;
  white-space: pre-wrap;
  background: ${colors.softBlueBg};
  border: 1px solid ${colors.cardBorder};
  border-radius: 14px;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const LeftActions = styled.div`
  display: flex;
  gap: 8px;
`;

const DeleteButton = styled(SoftButton)`
  color: ${colors.required};
`;

const EmptyText = styled.p`
  margin: 0;
  padding: 0 16px;
  color: ${colors.textHint};
  font-size: 14px;
  text-align: center;
`;

const InterviewButton = styled(SubmitButton)`
  width: 148px;
  height: 37px;

  ${media.mobile} {
    width: 100%;
    height: 44px;
  }
`;
