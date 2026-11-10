/** 새 프로젝트 모달의 작품 유형 목록 */
export const WORK_TYPES = [
  { value: 'digital-illustration', label: '디지털 일러스트', category: '미술 창작물' },
  { value: 'character-design', label: '캐릭터 디자인', category: '미술 창작물' },
  { value: 'graphic-design', label: '그래픽 디자인', category: '미술 창작물' },
] as const;

export type WorkType = (typeof WORK_TYPES)[number]['value'];

export const getWorkTypeLabel = (value: WorkType) =>
  WORK_TYPES.find((type) => type.value === value)?.label ?? '';
