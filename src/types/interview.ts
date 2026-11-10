/** Copyright Brief 필수 항목(필드) */
export type BriefFieldKey =
  | 'ai-tool'
  | 'ai-purpose'
  | 'ai-output-usage'
  | 'human-creation'
  | 'human-edits';

/** done: 설명이 충분함 / needs-work: 미입력이거나 설명이 모호함 → 질문 대상 */
export type BriefFieldStatus = 'done' | 'needs-work';

export interface BriefField {
  key: BriefFieldKey;
  label: string;
  /** 현재 입력된 내용 요약 (보완 필요면 보완이 필요한 이유) */
  summary: string;
  status: BriefFieldStatus;
}

/** 한 필드를 보완하기 위한 질문 (지금은 목업, 나중에 AI 서버 응답으로 교체) */
export interface InterviewQuestion {
  fieldKey: BriefFieldKey;
  question: string;
  reference: { name: string; type: string };
  reason: string;
}

export interface InterviewMessage {
  id: string;
  role: 'ai' | 'user';
  text: string;
}

export type InterviewStatus = 'not-started' | 'in-progress' | 'completed';

/** 프로젝트별 AI 인터뷰 진행 상태 */
export interface InterviewSession {
  status: InterviewStatus;
  fields: BriefField[];
  /** 시작할 때 정한 질문 순서 (보완 필요 필드 순서대로) */
  questionKeys: BriefFieldKey[];
  /** 지금 묻고 있는 질문의 순서 (questionKeys 기준) */
  currentIndex: number;
  messages: InterviewMessage[];
  /** 저장한 필드별 답변 */
  answers: Partial<Record<BriefFieldKey, string>>;
  /** 현재 질문에 보낸 답변 (아직 저장 전). 여러 번 보내면 줄바꿈으로 이어 붙임 */
  draftAnswer: string | null;
}
