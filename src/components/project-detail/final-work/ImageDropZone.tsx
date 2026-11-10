import { useState } from 'react';
import type { DragEvent } from 'react';
import styled from 'styled-components';
import imageIcon from '../../../assets/final-work-image.svg';
import { SoftButton } from './finalWork.styles';
import { useImageFileInput } from '../../../hooks/useImageFileInput';
import { colors } from '../../../styles/theme';

interface Props {
  /** 선택한 이미지 미리보기 URL (있으면 안내 대신 미리보기 표시) */
  previewUrl?: string;
  onSelect: (file: File) => void;
  onInvalid: () => void;
}

/** 점선 드롭 영역: 드래그 앤 드롭 + "파일 선택" (JPG·PNG만) */
export default function ImageDropZone({ previewUrl, onSelect, onInvalid }: Props) {
  const [isDragOver, setIsDragOver] = useState(false);
  const { openPicker, handleFile, fileInput } = useImageFileInput({ onSelect, onInvalid });

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault(); // drop 허용
    setIsDragOver(true);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <Zone
      $active={isDragOver}
      $hasPreview={!!previewUrl}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      // 미리보기 상태에서는 영역을 누르면 다른 이미지로 바꿀 수 있게
      onClick={previewUrl ? openPicker : undefined}
    >
      {previewUrl ? (
        <Preview src={previewUrl} alt="선택한 최종 작품 이미지" />
      ) : (
        <Guide>
          <GuideTop>
            <IconCircle>
              <img src={imageIcon} alt="" width={17.8} height={16.48} />
            </IconCircle>
            <GuideText>이미지를 드래그하거나 파일을 선택하세요</GuideText>
          </GuideTop>
          <PickButton type="button" onClick={openPicker}>
            파일 선택
          </PickButton>
        </Guide>
      )}
      {fileInput}
    </Zone>
  );
}

const Zone = styled.div<{ $active: boolean; $hasPreview: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 284px;
  overflow: hidden;
  background: ${colors.softBlueBg};
  border: 1px dashed ${({ $active }) => ($active ? colors.primary : colors.softBlueBorder)};
  border-radius: 14px;
  cursor: ${({ $hasPreview }) => ($hasPreview ? 'pointer' : 'default')};
  transition: border-color 0.15s;
`;

const Preview = styled.img`
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const Guide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 21px;
  width: 229px;
`;

const GuideTop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const IconCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: #eef3ff;
  border-radius: 999px;

  img {
    display: block;
  }
`;

const GuideText = styled.p`
  margin: 0;
  color: ${colors.textSecondary};
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
  text-align: center;
  white-space: nowrap;
`;

const PickButton = styled(SoftButton)`
  width: 116px;
  height: 34px;
  font-size: 13px;
`;
