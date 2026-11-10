import type { BriefReport } from '../types/brief';
import type { InterviewSession } from '../types/interview';
import type { FinalWork, ProcessMaterial } from '../types/project';
import { resolveRegisteredAt } from './registeredAt';

// Copyright Brief 진행 규칙 (서버 연동 시 이 파일과 mocks/brief.ts 만 바꾸면 되도록 모음)

/** 생성 중 단계 하나당 걸리는 시간 (목업) */
export const BRIEF_STEP_DURATION_MS = 1200;
export const BRIEF_STEP_COUNT = 3;
/** 생성 시작부터 완료까지 (목업) */
export const BRIEF_GENERATION_TOTAL_MS = BRIEF_STEP_DURATION_MS * BRIEF_STEP_COUNT;

export type GenerationStepStatus = 'done' | 'in-progress' | 'waiting';

/** 생성 시작 시각 기준 단계별 상태 (탭을 나갔다 와도 경과 시간으로 이어서 표시) */
export function getGenerationStepStatuses(
  startedAt: string,
  now = Date.now(),
): GenerationStepStatus[] {
  const current = Math.floor((now - Date.parse(startedAt)) / BRIEF_STEP_DURATION_MS);
  return Array.from({ length: BRIEF_STEP_COUNT }, (_, i) =>
    i < current ? 'done' : i === current ? 'in-progress' : 'waiting',
  );
}

/** PDF 파일 이름: Idea2IP_{공백 없는 프로젝트 이름}_CopyrightBrief_v{버전}.pdf */
export const buildBriefFileName = (projectTitle: string, version: number) =>
  `Idea2IP_${projectTitle.replace(/\s+/g, '')}_CopyrightBrief_v${version}.pdf`;

/** 리포트 생성 이후 새로 추가된 정보 개수 (업데이트 배너) */
export function countNewInfoSince(
  report: BriefReport,
  materials: ProcessMaterial[],
  finalWork: FinalWork | undefined,
  interview: InterviewSession,
) {
  const since = Date.parse(report.generatedAt);
  const isNew = (iso?: string) => !!iso && Date.parse(iso) > since;

  return {
    answers: Object.values(interview.answeredAt ?? {}).filter(isNew).length,
    materials: materials.filter((m) => isNew(resolveRegisteredAt(m, m.createdAt))).length,
    finalWork: finalWork && isNew(resolveRegisteredAt(finalWork, finalWork.updatedAt)) ? 1 : 0,
  };
}

/** 배너 두 번째 줄: 0개인 항목은 빼고 " · "로 연결 */
export function describeNewInfo(counts: ReturnType<typeof countNewInfoSince>) {
  return [
    counts.answers && `새 인터뷰 답변 ${counts.answers}개`,
    counts.materials && `새 제작 자료 ${counts.materials}개`,
    counts.finalWork && `새 최종 작품 ${counts.finalWork}개`,
  ]
    .filter(Boolean)
    .join(' · ');
}
