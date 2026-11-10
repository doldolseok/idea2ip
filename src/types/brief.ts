import type { EvidenceKind } from './contribution';

/** Copyright Brief 섹션 (리포트 행 01~05) */
export type BriefSectionKey =
  'overview' | 'ai-output' | 'human-expression' | 'references' | 'supplement';

/** 서버(AI)가 섹션별로 정리해서 줄 결과 형태 */
export interface BriefSection {
  key: BriefSectionKey;
  /** 리포트 행 제목 (예: 신청할 저작물 전체 개요) */
  title: string;
  /** 리포트 행 보조 문구 */
  summary: string;
  /** 본문 (편집 모달에서 수정 가능) */
  content: string;
  /** 출처 태그 (창작 기여 정리와 같은 종류) */
  sources: EvidenceKind[];
  /** 사용자가 직접 수정한 시각 (있으면 "사용자 수정됨", 리포트 업데이트 때 덮어쓰지 않음) */
  userEditedAt?: string;
}

/** 서버가 줄 리포트 결과 */
export interface BriefReport {
  version: number;
  /** 생성 시각 (ISO 8601, 이후 추가된 정보로 업데이트 배너 판단) */
  generatedAt: string;
  sections: BriefSection[];
}

export type BriefStatus = 'not-generated' | 'generating' | 'generated';

/** 프로젝트별 Copyright Brief 상태 */
export interface BriefState {
  status: BriefStatus;
  /** 현재 리포트 */
  report?: BriefReport;
  /** 직전 버전 (1개만 보관, 보는 화면은 아직 없음) */
  previous?: BriefReport;
  /** 생성 시작 시각 (생성 중 단계 진행 표시용) */
  generationStartedAt?: string;
}
