import type { WorkType } from '../constants/workTypes';
import type { MaterialType } from '../constants/materialTypes';

export type ProjectStatus = 'in-progress' | 'done';

export interface Project {
  id: string;
  title: string;
  workType: WorkType;
  status: ProjectStatus;
  /** ISO 8601 문자열 */
  updatedAt: string;
  thumbnailUrl?: string;
}

/** 제작 과정 탭의 타임라인 항목 (제작자료) */
export interface ProcessMaterial {
  id: string;
  type: MaterialType;
  title: string;
  /** 유형별 내용 (AI 산출물 내용·활용 방식 / 직접 수정·추가한 내용 / 구상·스케치 내용) */
  description: string;
  /** 사용한 AI 도구 (AI 활용 자료만) */
  aiTool?: string;
  /** ISO 8601 문자열 */
  createdAt: string;
  thumbnailUrl?: string;
  /** 업로드한 이미지 파일명 (수정 모달에서 표시) */
  imageName?: string;
}
