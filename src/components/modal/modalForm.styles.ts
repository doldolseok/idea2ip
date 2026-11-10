import styled from 'styled-components';
import { colors } from '../../styles/theme';

// 모달 입력 폼 공통 스타일 (새 프로젝트, 제작 과정 자료 추가)
// 모달마다 Figma 값이 조금씩 달라서 필요한 곳은 styled(...)로 덮어써서 사용

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const FieldLabel = styled.label`
  display: block;
  margin: 0 0 16px;
  color: ${colors.text};
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
`;

const fieldBase = `
  width: 100%;
  color: ${colors.text};
  font-size: 13px;
  background: ${colors.card};
  border: 1px solid ${colors.border};
  border-radius: 10px;
  outline: none;
  transition: border-color 0.15s;

  &::placeholder {
    color: ${colors.muted};
  }

  &:focus {
    border-color: ${colors.primary};
  }
`;

export const TextInput = styled.input`
  ${fieldBase}
  height: 46px;
  padding: 0 13px;
`;

export const TextArea = styled.textarea`
  ${fieldBase}
  height: 84px;
  padding: 12px 13px;
  font-family: inherit;
  line-height: normal;
  resize: none;
`;

/** 취소 / 확인 버튼 줄 (오른쪽 정렬). 경고 토스트 기준점(ToastAnchor)을 안에 넣어서 사용 */
export const ModalActions = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;

/* 경고 토스트 기준점: 버튼 바로 위에 살짝 겹치게 */
export const ToastAnchor = styled.div`
  position: absolute;
  top: -21px;
  left: calc(50% + 42px);
  width: 0;
  height: 0;
`;

const ModalButton = styled.button`
  height: 46px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s;
`;

export const CancelButton = styled(ModalButton)`
  width: 136px;
  color: ${colors.text};
  background: ${colors.card};
  border: 1px solid ${colors.border};

  &:hover {
    background: ${colors.bg};
  }
`;

export const SubmitButton = styled(ModalButton)`
  width: 158px;
  color: #fff;
  background: ${colors.selected};
  border: 0;

  &:hover {
    background: ${colors.primaryHover};
  }
`;
