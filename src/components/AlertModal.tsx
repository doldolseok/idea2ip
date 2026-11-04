import styled, { keyframes } from 'styled-components';
import { colors } from '../styles/theme';

interface Props {
  message: string;
  onClose: () => void;
}

/** 입력창 바로 아래, 버튼 위에 살짝 겹쳐서 뜨는 안내 모달. 클릭하면 바로 닫혀. */
export default function AlertModal({ message, onClose }: Props) {
  return (
    <Toast role="alert" onClick={onClose}>
      {message}
    </Toast>
  );
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translate(-50%, 4px); }
  to   { opacity: 1; transform: translate(-50%, 0); }
`;

const Toast = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 210px;
  height: 41px;
  padding: 0 24px;
  transform: translateX(-50%);
  border-radius: 12px;
  background: rgba(230, 230, 230, 0.94);
  color: ${colors.muted};
  font-size: 16px;
  white-space: nowrap;
  cursor: pointer;
  animation: ${fadeIn} 0.18s ease-out;
`;