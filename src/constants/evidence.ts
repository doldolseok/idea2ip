import type { EvidenceKind } from '../types/contribution';

/** 출처 태그 이름 (창작 기여 정리, Copyright Brief 공통) */
export const EVIDENCE_LABEL: Record<EvidenceKind, string> = {
  'user-statement': '사용자 진술',
  attachment: '첨부자료 기반',
  unverified: '미확인',
};

/** 범례·필터 등에서 쓰는 순서 */
export const EVIDENCE_KINDS: EvidenceKind[] = ['user-statement', 'attachment', 'unverified'];
