import styled from 'styled-components';
import { useImageFileInput } from '../../hooks/useImageFileInput';
import { colors, media } from '../../styles/theme';

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
  const { openPicker, fileInput } = useImageFileInput({
    onSelect: onChange,
    // 잘못된 형식을 고르면 기존 선택도 비움
    onInvalid: () => {
      onChange(null);
      onInvalid();
    },
  });

  return (
    <Box>
      <Text>
        <BoxTitle>이미지 파일 등록</BoxTitle>
        <Desc>
          {file?.name ?? existingName ?? 'PNG, JPG, 화면 캡처/렌더링 이미지 파일을 업로드 해주세요.'}
        </Desc>
      </Text>
      <FileButton type="button" onClick={openPicker}>
        파일선택
      </FileButton>
      {fileInput}
    </Box>
  );
}

const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 10px 14px;

  ${media.mobile} {
    gap: 12px;
  }
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

  ${media.mobile} {
    min-height: 40px;
  }
`;
