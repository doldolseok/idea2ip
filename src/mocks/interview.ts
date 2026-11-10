import type { BriefField, BriefFieldKey, InterviewQuestion } from '../types/interview';

// TODO: Copyright Brief / AI 인터뷰 API 연동 시 교체
// 지금은 모든 프로젝트가 같은 필드 상태(Figma 값 그대로)로 시작

export const MOCK_BRIEF_FIELDS: BriefField[] = [
  { key: 'ai-tool', label: '사용한 AI 도구', summary: 'Midjourney', status: 'done' },
  { key: 'ai-purpose', label: 'AI 활용 목적', summary: '배경 색감·분위기 참고', status: 'done' },
  {
    key: 'ai-output-usage',
    label: 'AI 산출물 활용 방식',
    summary: '참고했다는 설명은 있으나 최종 반영 방식이 모호함',
    status: 'needs-work',
  },
  { key: 'human-creation', label: '직접 창작한 요소', summary: '캐릭터 표정·귀 형태', status: 'done' },
  {
    key: 'human-edits',
    label: '직접 수정·추가한 표현',
    summary: '‘수정했다’는 설명을 구체화해야 함',
    status: 'needs-work',
  },
];

/** 필드별 목업 질문 (보완 필요 필드만 실제로 물어봄) */
export const MOCK_QUESTIONS: Record<BriefFieldKey, InterviewQuestion> = {
  'ai-tool': {
    fieldKey: 'ai-tool',
    question: '작업에 사용한 AI 도구와 버전을 알려 주세요.',
    reference: { name: '배경 색감 시안', type: 'AI 활용 자료' },
    reason: '사용한 AI 도구 정보가 비어 있습니다.',
  },
  'ai-purpose': {
    fieldKey: 'ai-purpose',
    question: 'AI를 어떤 목적으로 활용하셨나요?',
    reference: { name: '배경 색감 시안', type: 'AI 활용 자료' },
    reason: 'AI 활용 목적에 대한 설명이 부족합니다.',
  },
  'ai-output-usage': {
    fieldKey: 'ai-output-usage',
    question: 'AI 생성 이미지는 최종 작품에 어떻게 활용하셨나요?',
    reference: { name: '배경 색감 시안', type: 'AI 활용 자료' },
    reason: 'AI 산출물을 참고했다는 설명은 있으나 최종 작품에 반영한 방식이 모호합니다.',
  },
  'human-creation': {
    fieldKey: 'human-creation',
    question: '처음부터 직접 창작한 요소는 무엇인가요?',
    reference: { name: '초기 스케치', type: '초기 스케치' },
    reason: '직접 창작한 요소에 대한 설명이 부족합니다.',
  },
  'human-edits': {
    fieldKey: 'human-edits',
    question: 'AI 결과물에서 직접 수정하거나 새로 추가한 부분을 구체적으로 알려 주세요.',
    reference: { name: '캐릭터 수정본', type: '직접 수정 자료' },
    reason: '직접 수정한 캐릭터 요소들에 대한 설명이 부족합니다.',
  },
};

export const GREETING_MESSAGE = '안녕하세요! 등록하신 창작 자료를 바탕으로 몇 가지 질문을 드릴게요.';

/** 사용자가 답변을 보낸 뒤 AI가 보내는 짧은 확인 메시지 */
export const ACK_MESSAGE =
  '답변 감사합니다. 더 덧붙일 내용이 없다면 ‘답변 저장 및 다음으로’를 눌러 주세요.';
