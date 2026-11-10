import styled from 'styled-components';
import { colors } from '../../../styles/theme';

// 최종 작품 탭 공통 스타일 (등록 화면 / 저장 후 화면)

/** 이미지 카드 : 정보 카드 = 492 : 536 (Figma 너비 비율, 화면 너비에 맞춰 늘어남) */
export const CardsRow = styled.div`
  position: relative;
  display: flex;
  align-items: stretch;
  gap: 16px;
`;

/** 흰색 카드 (테두리 없음) */
export const Panel = styled.section<{ $ratio: number }>`
  flex: ${({ $ratio }) => $ratio} 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 20px 14px;
  background: ${colors.card};
  border-radius: 14px;
`;

export const PanelTitle = styled.h3`
  margin: 0;
  color: ${colors.textStrong};
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
`;

/** 흰 배경 + 연파랑 테두리 보조 버튼 (파일 선택, 작품 교체, 설명 수정) */
export const SoftButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 114px;
  height: 37px;
  padding: 0;
  color: ${colors.primary};
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  background: ${colors.card};
  border: 1px solid ${colors.softBlueBorder};
  border-radius: 9px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${colors.softBlueBg};
  }
`;

/* 경고 토스트 위치: 카드 아래쪽 버튼 줄 바로 위 가운데 (저장 후 화면의 작품 교체/설명 수정 버튼을 가리지 않게) */
export const ToastSpot = styled.div`
  position: absolute;
  bottom: 92px;
  left: 50%;
  width: 0;
  height: 0;
`;
