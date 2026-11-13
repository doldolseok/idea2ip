import styled from 'styled-components';
import { colors, media } from '../../../styles/theme';

// AI 인터뷰 탭 시작 전 화면 공통 스타일 (Figma 03-A / 03-A1)

/** 테두리 있는 흰 카드 */
export const Panel = styled.section<{ $ratio: number }>`
  flex: ${({ $ratio }) => $ratio} 1 0;
  min-width: 0;
  min-height: 464px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px;
  background: ${colors.card};
  border: 1px solid ${colors.panelBorder};
  border-radius: 14px;

  ${media.tablet} {
    flex: none;
    min-height: 0;
  }

  ${media.mobile} {
    padding: 16px 14px;
  }
`;

export const PanelTitle = styled.h3`
  margin: 0;
  color: ${colors.text};
  font-size: 14px;
  font-weight: 700;
  line-height: 18px;
`;

export const Caption = styled.p`
  margin: 0;
  color: ${colors.textHint};
  font-size: 9px;
  line-height: 13px;
`;

/** 필드/자료 한 줄 (회색 배경) */
export const InfoRow = styled.li<{ $height: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: ${({ $height }) => $height}px;
  padding: 0 10px;
  background: ${colors.rowBg};
  border-radius: 9px;
`;

export const RowText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const RowLabel = styled.p`
  margin: 0;
  color: ${colors.text};
  font-size: 10px;
  font-weight: 500;
  line-height: 14px;
`;

export const RowDesc = styled.p`
  margin: 0;
  overflow: hidden;
  color: ${colors.textHint};
  font-size: 9px;
  line-height: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const RowList = styled.ul<{ $gap: number; $minHeight: number }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => $gap}px;
  min-height: ${({ $minHeight }) => $minHeight}px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

/** 상태 칩: positive(완료·준비됨, 파랑) / neutral(보완 필요·필요, 회색) */
export const Pill = styled.span<{ $tone: 'positive' | 'neutral'; $width: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${({ $width }) => $width}px;
  height: 24px;
  color: ${({ $tone }) => ($tone === 'positive' ? colors.primary : colors.textHint)};
  font-size: 10px;
  font-weight: 500;
  line-height: 14px;
  white-space: nowrap;
  background: ${({ $tone }) => ($tone === 'positive' ? colors.chipPositiveBg : colors.rowBg)};
  border-radius: 12px;
`;

/** 연한 파랑 안내 박스 */
export const NoteBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 8px 10px;
  font-size: 9px;
  line-height: 13px;
  background: ${colors.softBlueBg};
  border-radius: 8px;

  p {
    margin: 0;
    color: ${colors.textHint};
  }

  p:first-child {
    color: ${colors.primary};
    font-weight: 500;
  }
`;
