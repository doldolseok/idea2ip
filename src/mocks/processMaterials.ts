import type { ProcessMaterial } from '../types/project';

const SAMPLE_MATERIALS: ProcessMaterial[] = [
  {
    id: 'material-1',
    type: 'sketch',
    title: '초기 스케치',
    description: '캐릭터 실루엣과 포즈 구상',
    createdAt: '2026-10-01T09:00:00+09:00',
  },
  {
    id: 'material-2',
    type: 'ai',
    aiTool: 'Midjourney',
    title: '컬러 러프',
    description: '달빛 톤 배색 시안 3종',
    createdAt: '2026-10-08T09:00:00+09:00',
  },
  {
    id: 'material-3',
    type: 'manual',
    title: '최종 채색',
    description: '배경 정리 및 디테일 보정',
    createdAt: '2026-10-20T09:00:00+09:00',
  },
];

// TODO: 제작자료 API 연동 시 교체
// 프로젝트 ID별 제작자료. 여기에 없는 프로젝트(새로 만든 프로젝트 등)는 제작자료가 비어 있음
export const MOCK_MATERIALS_BY_PROJECT: Record<string, ProcessMaterial[]> = {
  'mock-1': SAMPLE_MATERIALS,
  'mock-2': SAMPLE_MATERIALS,
  'mock-3': SAMPLE_MATERIALS,
};
