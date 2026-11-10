import styled, { css } from 'styled-components';
import { Pill } from './interview/interview.styles';
import type { EvidenceKind } from '../../types/contribution';
import { EVIDENCE_LABEL } from '../../constants/evidence';

/** 시안의 두 가지는 파랑 칩, "미확인"은 기존 회색 칩(AI 인터뷰 "보완 필요")과 같은 스타일 */
const CHIP: Record<EvidenceKind, { tone: 'positive' | 'neutral'; width: number }> = {
  'user-statement': { tone: 'positive', width: 82 },
  attachment: { tone: 'positive', width: 88 },
  unverified: { tone: 'neutral', width: 60 },
};

/**
 * 크기: sm 22px(창작 기여 정리 상세 패널) / md 24px(리포트 범례) / lg 28px(Brief 편집 모달)
 */
export default function EvidenceTag({
  kind,
  size = 'md',
}: {
  kind: EvidenceKind;
  size?: 'sm' | 'md' | 'lg';
}) {
  const chip = CHIP[kind];
  const width = size === 'lg' ? chip.width + 16 : chip.width;
  return (
    <Tag $tone={chip.tone} $width={width} $size={size}>
      {EVIDENCE_LABEL[kind]}
    </Tag>
  );
}

const Tag = styled(Pill)<{ $size: 'sm' | 'md' | 'lg' }>`
  ${({ $size }) =>
    $size === 'sm' &&
    css`
      height: 22px;
      font-size: 9px;
      line-height: 13px;
      border-radius: 11px;
    `}

  ${({ $size }) =>
    $size === 'lg' &&
    css`
      height: 28px;
      font-size: 12px;
      line-height: normal;
      border-radius: 14px;
    `}
`;
