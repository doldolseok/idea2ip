import { MOCK_BRIEF_FIELDS, MOCK_QUESTIONS } from '../mocks/interview';
import type { BriefField, BriefFieldKey, InterviewMessage, InterviewSession } from '../types/interview';
import type { ProcessMaterial } from '../types/project';

// AI 인터뷰 진행 규칙 모음 (지금은 목업, 서버 연동 시 이 파일만 바꾸면 되도록 한곳에 모음)

/** 시작 전 기본 상태 (selector가 매번 새 객체를 만들지 않도록 고정 상수) */
export const INITIAL_INTERVIEW: InterviewSession = {
  status: 'not-started',
  fields: MOCK_BRIEF_FIELDS,
  questionKeys: [],
  currentIndex: 0,
  messages: [],
  answers: {},
  draftAnswer: null,
};

/** 질문 대상: 보완 필요 필드 (목록 순서대로) */
export const buildQuestionPlan = (fields: BriefField[]): BriefFieldKey[] =>
  fields.filter((field) => field.status === 'needs-work').map((field) => field.key);

export const getQuestion = (key: BriefFieldKey) => MOCK_QUESTIONS[key];

/** 지금 묻고 있는 질문 (진행 중이 아니면 undefined) */
export const getCurrentQuestion = (session: InterviewSession) => {
  const key = session.questionKeys[session.currentIndex];
  return key ? getQuestion(key) : undefined;
};

/**
 * 마지막 질문인지 판단 (인터뷰 종료 조건)
 * 지금은 "현재 질문 순서가 질문 목록의 마지막인지"로 판단.
 * TODO: 서버가 종료 여부를 알려주면 이 함수만 서버 응답 기준으로 교체
 */
export const isLastQuestion = (session: InterviewSession) =>
  session.currentIndex >= session.questionKeys.length - 1;

/**
 * 필수 자료 준비 상태 (3개 모두 필수)
 * 최종 작품 저장 여부 / AI 활용 자료 1개 이상 / 직접 수정 자료 1개 이상
 */
export const getMaterialReadiness = (hasFinalWork: boolean, materials: ProcessMaterial[]) => [
  { key: 'final', label: '최종 작품', readyDesc: '완성본 + 설명', ready: hasFinalWork },
  {
    key: 'ai',
    label: 'AI 활용 자료',
    readyDesc: '1개 이상 연결',
    ready: materials.some((m) => m.type === 'ai'),
  },
  {
    key: 'manual',
    label: '직접 수정 자료',
    readyDesc: '1개 이상 연결',
    ready: materials.some((m) => m.type === 'manual'),
  },
];

export const createMessage =(role: InterviewMessage['role'], text: string): InterviewMessage => ({
  id: crypto.randomUUID(),
  role,
  text,
});
