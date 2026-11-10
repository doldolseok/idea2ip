import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Panel, PanelTitle, SoftButton } from './finalWork.styles';
import { SubmitButton, TextArea } from '../../modal/modalForm.styles';
import { useImageFileInput } from '../../../hooks/useImageFileInput';
import { getWorkTypeSummary } from '../../../constants/workTypes';
import { useProjectStore } from '../../../store/projectStore';
import type { FinalWork, Project } from '../../../types/project';
import { colors } from '../../../styles/theme';

interface Props {
  project: Project;
  finalWork: FinalWork;
  showAlert: (message: string) => void;
  onGoToInterview: () => void;
}

// 최종 작품 탭 2번 상태: 저장한 최종 작품 (작품 교체 / 설명 수정)

export default function FinalWorkView({
  project,
  finalWork,
  showAlert,
  onGoToInterview,
}: Props) {
  const saveFinalWork = useProjectStore((state) => state.saveFinalWork);
  const save = (changes: Partial<FinalWork>) =>
    saveFinalWork(project.id, { ...finalWork, ...changes, updatedAt: new Date().toISOString() });

  // 작품 교체: 파일 선택 창 → 형식 검사 → 이미지 교체
  const { openPicker, fileInput } = useImageFileInput({
    onSelect: (file) => {
      URL.revokeObjectURL(finalWork.imageUrl);
      save({ imageUrl: URL.createObjectURL(file), imageName: file.name });
    },
    onInvalid: () => showAlert('지원하지 않는 이미지 형식입니다.'),
  });

  // 설명 수정: 별도 UI 없이 같은 칸을 편집 가능하게 전환
  // 다시 "설명 수정"을 누르거나 칸 밖을 누르면 저장 (빈 칸이면 경고 후 편집 상태 유지)
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(finalWork.description);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing) descriptionRef.current?.focus();
  }, [isEditing]);

  const commitDescription = () => {
    if (!draft.trim()) {
      showAlert('최종 작품 설명을 입력해 주세요.');
      return;
    }
    if (draft.trim() !== finalWork.description) save({ description: draft.trim() });
    setIsEditing(false);
  };

  const toggleEditing = () => {
    if (isEditing) {
      commitDescription();
      return;
    }
    setDraft(finalWork.description);
    setIsEditing(true);
  };

  return (
    <>
      <ImagePanel $ratio={492}>
        <PanelTitle>등록된 최종 작품</PanelTitle>
        <ImageBody>
          <PreviewBox>
            <img src={finalWork.imageUrl} alt={`${project.title} 최종 작품`} />
          </PreviewBox>
          <SoftButton type="button" onClick={openPicker}>
            작품 교체
          </SoftButton>
          {fileInput}
        </ImageBody>
      </ImagePanel>

      <DescriptionPanel $ratio={536}>
        <DescriptionBody>
          <DescriptionBlock>
            <DescriptionTitle as="label" htmlFor="final-work-saved-description">
              최종 작품 설명
            </DescriptionTitle>
            <Description
              ref={descriptionRef}
              id="final-work-saved-description"
              readOnly={!isEditing}
              value={isEditing ? draft : finalWork.description}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={() => isEditing && commitDescription()}
            />
          </DescriptionBlock>
          <Summary>
            <span>프로젝트 · {project.title}</span>
            <span>저작물 유형 · {getWorkTypeSummary(project.workType)}</span>
          </Summary>
        </DescriptionBody>

        <Actions>
          <SoftButton
            type="button"
            // 편집 중 버튼을 눌러도 칸이 먼저 blur 되지 않게 (클릭에서 한 번만 저장)
            onMouseDown={(e) => e.preventDefault()}
            onClick={toggleEditing}
          >
            설명 수정
          </SoftButton>
          <InterviewButton type="button" onClick={onGoToInterview}>
            AI 인터뷰 준비 확인
          </InterviewButton>
        </Actions>
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

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InterviewButton = styled(SubmitButton)`
  width: 148px;
  height: 37px;
`;
