import { create } from 'zustand';
import { MOCK_MATERIALS_BY_PROJECT } from '../mocks/processMaterials';
import type { ProcessMaterial, Project } from '../types/project';

// TODO: 백엔드 API 연동 시 TanStack Query로 교체 (현재는 임시 목업 데이터, 새로고침하면 초기화됨)
// 빈 배열로 바꾸면 "프로젝트가 없을 때" 화면을 확인할 수 있어요.
const MOCK_PROJECTS: Project[] = [
  {
    id: 'mock-1',
    title: '달빛 정원 캐릭터',
    workType: 'digital-illustration',
    status: 'in-progress',
    updatedAt: '2026-10-20T09:00:00+09:00',
  },
  {
    id: 'mock-2',
    title: '바다 마을 포스터',
    workType: 'graphic-design',
    status: 'in-progress',
    updatedAt: '2026-10-15T09:00:00+09:00',
  },
  {
    id: 'mock-3',
    title: '숲속 친구들',
    workType: 'character-design',
    status: 'done',
    updatedAt: '2026-10-02T09:00:00+09:00',
  },
];

interface ProjectState {
  /** 최신순 (새로 만든 프로젝트가 맨 앞) */
  projects: Project[];
  /** 프로젝트 ID별 제작자료 (제작 과정 탭 타임라인) */
  materialsByProjectId: Record<string, ProcessMaterial[]>;
  addProject: (project: Project) => void;
  /** 프로젝트에 제작자료 추가 (타임라인 맨 뒤) */
  addMaterial: (projectId: string, material: ProcessMaterial) => void;
  /** 같은 id의 제작자료를 교체 (타임라인 순서 유지) */
  updateMaterial: (projectId: string, material: ProcessMaterial) => void;
}

export const useProjectStore = create<ProjectState>()((set) => ({
  projects: MOCK_PROJECTS,
  materialsByProjectId: MOCK_MATERIALS_BY_PROJECT,
  // 새 프로젝트는 제작자료가 빈 상태로 시작
  addProject: (project) =>
    set((state) => ({
      projects: [project, ...state.projects],
      materialsByProjectId: { ...state.materialsByProjectId, [project.id]: [] },
    })),
  addMaterial: (projectId, material) =>
    set((state) => ({
      materialsByProjectId: {
        ...state.materialsByProjectId,
        [projectId]: [...(state.materialsByProjectId[projectId] ?? []), material],
      },
    })),
  updateMaterial: (projectId, material) =>
    set((state) => ({
      materialsByProjectId: {
        ...state.materialsByProjectId,
        [projectId]: (state.materialsByProjectId[projectId] ?? []).map((m) =>
          m.id === material.id ? material : m,
        ),
      },
    })),
}));

// selector가 매번 새 배열을 반환하면 무한 렌더링이 생기므로 고정된 빈 배열 사용
const NO_MATERIALS: ProcessMaterial[] = [];

/** 프로젝트의 제작자료 목록 (없으면 빈 배열) */
export const useProjectMaterials = (projectId: string) =>
  useProjectStore((state) => state.materialsByProjectId[projectId] ?? NO_MATERIALS);
