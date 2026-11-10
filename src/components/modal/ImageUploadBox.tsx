import { useRef } from 'react';
import type { ChangeEvent } from 'react';
import styled from 'styled-components';
import { SUPPORTED_IMAGE_ACCEPT, isSupportedImage } from '../../utils/image';
import { colors } from '../../styles/theme';

interface Props {
  file: File | null;
  /** 새 파일을 고르지 않았을 때 보여줄 기존 이미지 이름 (수정 모달) */
  existingName?: string;
  onChange: (file: File | null) => void;
  /** PNG/JPG가 아닌 파일을 골랐을 때 (경고 표시용) */
  onInvalid: () => void;
}

/** "이미지 파일 등록" 박스 + 파일선택 버튼 (새 프로젝트, 제작 과정 자료 추가 모달 공통) */
export default function ImageUploadBox({ file, existingName, onChange, onInvalid }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return; // 파일 선택 창에서 취소한 경우 기존 선택 유지

    if (!isSupportedImage(selected)) {
      e.target.value = ''; // 같은 파일을 다시 골라도 onChange가 다시 실행되게
      onChange(null);
      onInvalid();
      return;
    }

    onChange(selected);
  };

  return (
    <Box>
      <Text>
        <BoxTitle>이미지 파일 등록</BoxTitle>
        <Desc>
          {file?.name ?? existingName ?? 'PNG, JPG, 화면 캡처/렌더링 이미지 파일을 업로드 해주세요.'}
        </Desc>
      </Text>
      <FileButton type="button" onClick={() => inputRef.current?.click()}>
        파일선택
      </FileButton>
      <HiddenInput
        ref={inputRef}
        type="file"
        accept={SUPPORTED_IMAGE_ACCEPT}
        onChange={handleChange}
      />
    </Box>
  );
}

const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 10px 14px;
  background: #f9faff;
  border: 1px solid ${colors.border};
  border-radius: 10px;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  line-height: normal;
`;

const BoxTitle = styled.p`
  margin: 0;
  color: #000;
  font-size: 14px;
  font-weight: 600;
`;

const Desc = styled.p`
  margin: 0;
  overflow: hidden;
  color: ${colors.muted};
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileButton = styled.button`
  flex-shrink: 0;
  padding: 6px 16px;
  color: rgba(19, 28, 51, 0.8);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  background: transparent;
  border: 1px solid ${colors.border};
  border-radius: 15px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${colors.card};
  }
`;

const HiddenInput = styled.input`
  display: none;
`;
