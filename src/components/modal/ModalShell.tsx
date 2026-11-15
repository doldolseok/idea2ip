import { useEffect } from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import { colors, media } from '../../styles/theme';

interface Props {
  /** 제목 요소 id (aria-labelledby 연결용) */
  titleId: string;
  title: string;
  subtitle?: string;
  width?: number;
  /** Figma에서 그림자가 있는 모달만 true */
  shadow?: boolean;
  /** md: 20px 제목 (기본) / lg: 24px 굵은 제목 (Copyright Brief 편집) */
  size?: 'md' | 'lg';
  /** default: 진한 배경 / light: 옅은 배경 (리포트 탭) */
  dim?: 'default' | 'light';
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
  size = 'md',
  dim = 'default',
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
    <Overlay $dim={dim} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{ width }}
        $shadow={shadow}
      >
        <Header $size={size}>
          <Title id={titleId} $size={size}>
            {title}
          </Title>
          {subtitle && <Subtitle $size={size}>{subtitle}</Subtitle>}
        </Header>
        {children}
      </Dialog>
    </Overlay>
  );
}

/* 사이드바는 가리지 않고 메인 영역만 어둡게 */
type SizeProps = { $size: 'md' | 'lg' };

const Overlay = styled.div<{ $dim: 'default' | 'light' }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: var(--sidebar-width);
  /* 모바일 상단 바·메뉴보다 위 */
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;

  /* 모바일: 화면 너비에 맞추고 아래쪽에서 올라오는 시트처럼 */
  ${media.mobile} {
    align-items: flex-end;
    padding: 12px 0 0;
  }
  background: ${({ $dim }) => ($dim === 'light' ? colors.overlayLight : colors.overlay)};
`;

const Dialog = styled.div<{ $shadow: boolean }>`
  max-width: 100%;
  max-height: 100%;
  overflow-y: auto;
  padding: 0 28px;
  background: ${colors.card};
  border-radius: 18px;

  /* 모바일: 너비 꽉 차게, 내용이 길면 모달 안에서 스크롤 */
  ${media.mobile} {
    width: 100% !important;
    max-height: calc(100dvh - 12px);
    padding: 0 16px;
    border-radius: 18px 18px 0 0;
    overscroll-behavior: contain;
  }
  box-shadow: ${({ $shadow }) => ($shadow ? '0 10px 15px rgba(0, 0, 0, 0.15)' : 'none')};
`;

/* lg (Figma Copyright Brief 편집): 제목 위 26px, 제목-부제 9px, 구분선 위 16px */
const Header = styled.div<SizeProps>`
  display: flex;
  flex-direction: column;
  gap: ${({ $size }) => ($size === 'lg' ? 9 : 14)}px;
  padding: ${({ $size }) => ($size === 'lg' ? '26px 0 16px' : '18px 0 14px')};
  border-bottom: 1px solid ${colors.border};
`;

const Title = styled.h2<SizeProps>`
  margin: 0;
  color: ${colors.text};
  font-size: ${({ $size }) => ($size === 'lg' ? 24 : 20)}px;
  font-weight: ${({ $size }) => ($size === 'lg' ? 700 : 600)};
  line-height: normal;
`;

/* md: Figma 텍스트 박스 높이 10px 기준 (글자는 박스 밖으로 살짝 넘침) */
const Subtitle = styled.p<SizeProps>`
  height: ${({ $size }) => ($size === 'lg' ? 'auto' : '10px')};
  margin: 0;
  color: ${colors.muted};
  font-size: 13px;
  line-height: normal;
`;
