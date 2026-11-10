import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ImageDropZone from './ImageDropZone';
import { Panel, PanelTitle } from './finalWork.styles';
import {
  CancelButton,
  FieldLabel,
  ModalActions,
  SubmitButton,
  TextArea,
} from '../../modal/modalForm.styles';
import { getWorkTypeSummary } from '../../../constants/workTypes';
import { useProjectStore } from '../../../store/projectStore';
import type { Project } from '../../../types/project';
import { createRegisteredAt } from '../../../utils/registeredAt';
import { colors } from '../../../styles/theme';

interface Props {
  project: Project;
  showAlert: (message: string) => void;
}

// 최종 작품 탭 1번 상태: 최종 작품 등록 (이미지 + 작품 정보/설명)

export default function FinalWorkForm({ project, showAlert }: Props) {
  const saveFinalWork = useProjectStore((state) => state.saveFinalWork);
  const [image, setImage] = useState<{ file: File; url: string } | null>(null);
  const [description, setDescription] = useState('');
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  // 저장하지 않고 화면을 벗어나면 미리보기 URL 해제 (저장한 URL은 2번 상태에서 계속 사용)
  const unsavedUrl = useRef<string | null>(null);
  useEffect(() => () => {
    if (unsavedUrl.current) URL.revokeObjectURL(unsavedUrl.current);
  }, []);

  const replaceImage = (next: { file: File; url: string } | null) => {
    if (image) URL.revokeObjectURL(image.url);
    unsavedUrl.current = next?.url ?? null;
    setImage(next);
  };

  const handleSelect = (file: File) => replaceImage({ file, url: URL.createObjectURL(file) });

  const handleCancel = () => {
    replaceImage(null);
    setDescription('');
  };

  const handleSave = () => {
    // 위에서부터 순서대로 첫 번째 문제 하나만 안내
    if (!image) {
      showAlert('최종 작품 이미지를 등록해 주세요.');
      return;
    }
    if (!description.trim()) {
      showAlert('최종 작품 설명을 입력해 주세요.');
      descriptionRef.current?.focus();
      return;
    }

    unsavedUrl.current = null; // 저장했으니 해제하지 않음
    saveFinalWork(project.id, {
      imageUrl: image.url,
      imageName: image.file.name,
      description: description.trim(),
      updatedAt: new Date().toISOString(),
      // 작품 교체·설명 수정 때는 FinalWorkView가 기존 값을 그대로 유지
      registeredAt: createRegisteredAt(),
    });
  };

  return (
    <>
      <ImagePanel $ratio={492}>
        <PanelHead>
          <PanelTitle>최종 작품 이미지</PanelTitle>
          <Hint>JPG · PNG 이미지 파일을 등록해주세요.</Hint>
        </PanelHead>
        <ImageDropZone
          previewUrl={image?.url}
          onSelect={handleSelect}
          onInvalid={() => showAlert('지원하지 않는 이미지 형식입니다.')}
        />
      </ImagePanel>

      <InfoPanel $ratio={536}>
        <InfoBody>
          <InfoBlock>
            <InfoTitle>작품 정보</InfoTitle>
            <InfoRow>
              <InfoItem>
                <InfoLabel>프로젝트</InfoLabel>
                <InfoValue>{project.title}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>저작물 유형</InfoLabel>
                <InfoValue>{getWorkTypeSummary(project.workType)}</InfoValue>
              </InfoItem>
            </InfoRow>
          </InfoBlock>

          <div>
            <DescriptionLabel htmlFor="final-work-description">최종 작품 설명</DescriptionLabel>
            <DescriptionInput
              ref={descriptionRef}
              id="final-work-description"
              placeholder="최종 결과물의 주제, 시각적 특징 등을 간단히 설명해주세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </InfoBody>

        <Actions>
          <CancelButton type="button" onClick={handleCancel}>
            취소
          </CancelButton>
          <SaveButton type="button" onClick={handleSave}>
            최종 작품 저장
          </SaveButton>
        </Actions>
      </InfoPanel>
    </>
  );
}

const ImagePanel = styled(Panel)`
  gap: 20px;
  padding-bottom: 40px;
`;

const PanelHead = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Hint = styled.p`
  margin: 0;
  color: ${colors.textHint};
  font-size: 10px;
  line-height: 15px;
`;

const InfoPanel = styled(Panel)`
  gap: 36px;
  padding-bottom: 14px;
`;

const InfoBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 49px;
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const InfoTitle = styled(PanelTitle)`
  color: #000;
`;

const InfoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 130px;
  row-gap: 16px;
  line-height: 1.4;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const InfoLabel = styled.span`
  color: ${colors.textSecondary};
  font-size: 14px;
`;

const InfoValue = styled.span`
  color: ${colors.textStrong};
  font-size: 16px;
  font-weight: 500;
`;

const DescriptionLabel = styled(FieldLabel)`
  color: ${colors.textSecondary};
`;

const DescriptionInput = styled(TextArea)`
  height: 121px;
  background: #f6f8fc;

  &:focus {
    background: ${colors.card};
  }
`;

/* 정보 카드가 더 커져도 버튼은 카드 아래쪽에 */
const Actions = styled(ModalActions)`
  margin-top: auto;
`;

const SaveButton = styled(SubmitButton)`
  width: 148px;
`;
