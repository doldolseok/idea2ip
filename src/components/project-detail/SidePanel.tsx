import { useEffect } from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import { colors, media } from '../../styles/theme';

interface Props {
  /** 패널 너비 (창작 기여 정리 365, PDF 저장 374) */
  width: number;
  /** true면 메인 영역을 옅게 어둡게 (배경 클릭 시 닫힘) */
  overlay?: boolean;
  labelledBy: string;
  onClose: () => void;
  className?: string;
  children: ReactNode;
}

/**
 * 화면 오른쪽에 붙는 패널 틀 (창작 기여 정리 단계 상세, 리포트 PDF 저장)
 * Esc로 닫힘, 안쪽 여백·내용은 사용하는 쪽에서 styled(SidePanel)로 지정
 */
export default function SidePanel({
  width,
  overlay = false,
  labelledBy,
  onClose,
  className,
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
    <>
      {overlay && <Overlay onMouseDown={onClose} />}
      <Panel role="dialog" aria-labelledby={labelledBy} className={className} style={{ width }}>
        {children}
      </Panel>
    </>
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: var(--sidebar-width);
  z-index: 249;
  background: ${colors.overlayLight};
`;

const Panel = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 250;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: ${colors.card};
  border: 1px solid ${colors.contributionBorder};
  border-radius: 18px;
  box-shadow: -8px 8px 24px rgba(0, 0, 0, 0.08);

  /* 모바일: 화면 전체 너비로 열림 */
  ${media.mobile} {
    width: 100% !important;
    border-radius: 0;
    overscroll-behavior: contain;
  }
`;
