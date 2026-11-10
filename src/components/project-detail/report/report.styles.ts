import styled from 'styled-components';
import { colors } from '../../../styles/theme';

// 리포트(Copyright Brief) 탭 공통 스타일

/** 흰 카드 (테두리) */
export const ReportCard = styled.section`
  display: flex;
  flex-direction: column;
  background: ${colors.card};
  border: 1px solid ${colors.contributionBorder};
  border-radius: 14px;
`;

/** 번호 + 제목/설명 한 줄 (생성 전 목록, 리포트 목록) */
export const ListRow = styled.div<{ $height: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  height: ${({ $height }) => $height}px;
  padding: 0 12px;
  text-align: left;
  background: ${colors.card};
  border: 1px solid ${colors.contributionBorder};
  border-radius: 10px;
`;

export const RowLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

export const NumberBox = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 36px;
  color: ${colors.primary};
  font-size: 11px;
  font-weight: 600;
  line-height: 15px;
  background: ${colors.chipPositiveBg};
  border-radius: 9px;
`;

export const RowText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const RowTitle = styled.span`
  color: ${colors.textStrong};
  font-size: 12px;
  font-weight: 600;
  line-height: 17px;
`;

export const RowDesc = styled.span`
  overflow: hidden;
  color: ${colors.contributionMuted};
  font-size: 10px;
  line-height: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/** 연파랑 안내 박스 (첫 줄 파랑 굵게, 둘째 줄 회색) */
export const InfoNote = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 10px;
  line-height: 15px;

  p {
    margin: 0;
    color: ${colors.contributionMuted};
  }

  p:first-child {
    color: ${colors.primary};
    font-weight: 600;
  }
`;

/** 파란 버튼 (생성 / 업데이트 / PDF 저장 / PDF 다운로드) */
export const BlueButton = styled.button`
  flex-shrink: 0;
  height: 40px;
  padding: 0 16px;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
  background: ${colors.primary};
  border: 0;
  border-radius: 9px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: ${colors.primaryHover};
  }

  &:disabled {
    color: ${colors.contributionMuted};
    background: ${colors.rowBg};
    cursor: not-allowed;
  }
`;

/** 흰 배경 + 연파랑 테두리 버튼 (내용 직접 편집 / 취소) */
export const OutlineBlueButton = styled(BlueButton)`
  color: ${colors.primary};
  background: ${colors.card};
  border: 1px solid ${colors.softBlueBorder};

  &:hover:not(:disabled) {
    background: ${colors.softBlueBg};
  }
`;
