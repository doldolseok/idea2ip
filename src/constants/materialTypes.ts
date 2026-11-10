/**
 * 제작 과정 자료 유형 (자료 추가 모달의 칩 + 유형별 입력칸)
 * 라벨/안내 문구는 Figma 값 그대로, chipWidth는 Figma 칩 너비
 */
export const MATERIAL_TYPES = [
  {
    value: 'ai',
    label: 'AI 활용 자료',
    chipWidth: 112,
    detailLabel: 'AI 산출물의 내용 및 활용 방식',
    detailPlaceholder: 'AI로 무엇을 생성했고, 해당 결과물을 어떻게 활용했는지 작성해 주세요.',
    hasAiTool: true,
  },
  {
    value: 'manual',
    label: '직접 수정 자료',
    chipWidth: 124,
    detailLabel: '직접 수정 및 추가한 내용',
    detailPlaceholder: '어떤 부분을 직접 수정하거나 추가했는지 구체적으로 작성해 주세요.',
    hasAiTool: false,
  },
  {
    value: 'sketch',
    label: '초기 스케치',
    chipWidth: 100,
    detailLabel: '구상 및 스케치 내용',
    detailPlaceholder: '직접 구상하거나 스케치한 부분을 작성해 주세요.',
    hasAiTool: false,
  },
] as const;

export type MaterialType = (typeof MATERIAL_TYPES)[number]['value'];

export const DEFAULT_MATERIAL_TYPE: MaterialType = 'ai';
