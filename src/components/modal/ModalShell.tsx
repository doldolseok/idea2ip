import { useEffect } from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import { SIDEBAR_WIDTH } from '../Sidebar';
import { colors } from '../../styles/theme';

interface Props {
  /** 제목 요소 id (aria-labelledby 연결용) */
  titleId: string;
  title: string;
  subtitle?: string;
  width?: number;
  /** Figma에서 그림자가 있는 모달만 true */
  shadow?: boolean;
  onClose: () => void;
  children: ReactNode;
}

/**
 * 공통 모달 틀: 메인 영역만 어둡게 하는 배경 + 흰색 창 + 제목 영역(아래 구분선)
 * - 배경 클릭, ESC 로 닫힘
 * - 제목 영역 아래 간격과 아래쪽 여백은 children 쪽에서 정함
 */
export default function ModalShell({
  titleId,
  title,
  subtitle,
  width = 596,
  shadow = false,
  onClose,
  children,
}: Props) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <Overlay onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{ width }}
        $shadow={shadow}
      >
        <Header>
          <Title id={titleId}>{title}</Title>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </Header>
        {children}
      </Dialog>
    </Overlay>
  );
}

/* 사이드바는 가리지 않고 메인 영역만 어둡게 */
const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: ${SIDEBAR_WIDTH}px;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: ${colors.overlay};
`;

const Dialog = styled.div<{ $shadow: boolean }>`
  max-width: 100%;
  max-height: 100%;
  overflow-y: auto;
  padding: 0 28px;
  background: ${colors.card};
  border-radius: 18px;
  box-shadow: ${({ $shadow }) => ($shadow ? '0 10px 15px rgba(0, 0, 0, 0.15)' : 'none')};
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 0 14px;
  border-bottom: 1px solid ${colors.border};
`;

const Title = styled.h2`
  margin: 0;
  color: ${colors.text};
  font-size: 20px;
  font-weight: 600;
  line-height: normal;
`;

/* Figma 텍스트 박스 높이 10px 기준 (글자는 박스 밖으로 살짝 넘침) */
const Subtitle = styled.p`
  height: 10px;
  margin: 0;
  color: ${colors.muted};
  font-size: 13px;
  line-height: normal;
`;
