import { getWorkTypeSummary } from '../constants/workTypes';
import type { BriefReport, BriefSection, BriefSectionKey } from '../types/brief';
import type { InterviewSession } from '../types/interview';
import type { FinalWork, ProcessMaterial, Project } from '../types/project';
import { buildContributionTimeline } from '../utils/contribution';
import { STEP_KIND_LABEL } from '../utils/contribution';

// TODO: Copyright Brief 생성 API 연동 시 교체 (지금은 시안 문구 + 프로젝트 저장 값으로 만드는 목업)

/** 생성 전 화면 "생성 전 정보 확인" (시안 문구·값 그대로. 칩 숫자도 시안 값 사용) */
export const MOCK_BRIEF_READINESS = {
  writtenCount: 7,
  unverifiedCount: 1,
  items: [
    {
      no: '01',
      title: '작품 전체 개요',
      desc: '작품명·유형·주제·최종 작품 설명',
      status: 'written',
    },
    {
      no: '02',
      title: 'AI 활용 정보',
      desc: '사용 도구·활용 목적·산출물 활용 방식',
      status: 'written',
    },
    {
      no: '03',
      title: '인간의 창작적 표현',
      desc: '직접 제작·수정한 부분 및 창작적 선택',
      status: 'unverified',
      count: 1,
    },
    {
      no: '04',
      title: '창작 과정 참고자료',
      desc: '초기 스케치·AI 산출물·수정본·최종 작품 연결',
      status: 'written',
    },
  ],
} as const;

/** 생성 중 화면 단계 (시안 문구) */
export const BRIEF_GENERATION_STEPS = [
  { title: '입력 정보 정리', desc: '작품·AI 활용·창작 기여 정보를 필드별로 정리했어요.' },
  { title: '출처와 누락 정보 연결', desc: '인터뷰 답변·첨부자료·미확인 항목을 연결하고 있어요.' },
  { title: '설명 초안 생성', desc: '공식 안내서 주요 항목에 맞춰 Copyright Brief를 작성합니다.' },
] as const;

/** 섹션 제목 / 리포트 행 보조 문구 / 편집 모달 칩 이름 (시안 문구) */
export const BRIEF_SECTION_META: Record<
  BriefSectionKey,
  { no: string; title: string; summary: string; chip: string }
> = {
  overview: {
    no: '01',
    title: '신청할 저작물 전체 개요',
    summary: '작품명·유형·주제와 최종 창작물 설명',
    chip: '01 전체 개요',
  },
  'ai-output': {
    no: '02',
    title: '활용된 생성형 AI 산출물',
    summary: '사용 도구·활용 단계·산출물 활용 방식',
    chip: '02 AI 산출물',
  },
  'human-expression': {
    no: '03',
    title: '인간의 창작적 표현 부분',
    summary: '직접 제작·수정한 부분과 구체적인 창작적 선택',
    chip: '03 인간의 창작적 표현',
  },
  references: {
    no: '04',
    title: '창작 과정 참고자료',
    summary: '스케치·AI 산출물·중간 수정본·최종 작품',
    chip: '04 참고자료',
  },
  supplement: {
    no: '05',
    title: '추가 확인 및 보완사항',
    summary: '직접 수정 과정의 구체적인 차이 설명 추가 필요',
    chip: '05 보완사항',
  },
};

export const BRIEF_SECTION_KEYS = Object.keys(BRIEF_SECTION_META) as BriefSectionKey[];

/** 시안의 03 본문 */
const DEFAULT_HUMAN_EXPRESSION =
  '사용자는 캐릭터의 표정과 귀 모양을 직접 다시 그리고, 배치와 색상을 조정했습니다. 또한 AI 시안을 참고하되 최종 구도와 일부 형태를 직접 재구성했습니다.';

export interface BriefSourceData {
  project: Project;
  materials: ProcessMaterial[];
  finalWork?: FinalWork;
  interview: InterviewSession;
}

/** 섹션 본문/출처 목업 생성 (프로젝트에 저장된 값이 있으면 반영) */
function buildSectionContent(
  key: BriefSectionKey,
  { project, materials, finalWork, interview }: BriefSourceData,
): Pick<BriefSection, 'content' | 'sources'> {
  const aiMaterials = materials.filter((m) => m.type === 'ai');
  const manualMaterials = materials.filter((m) => m.type === 'manual');

  switch (key) {
    case 'overview':
      return {
        content: [
          `작품명: ${project.title}`,
          `저작물 유형: ${getWorkTypeSummary(project.workType)}`,
          `최종 작품 설명: ${finalWork?.description ?? '미확인 (최종 작품 설명이 등록되지 않았어요)'}`,
        ].join('\n'),
        sources: finalWork ? ['user-statement', 'attachment'] : ['user-statement', 'unverified'],
      };

    case 'ai-output': {
      const tools = [...new Set(aiMaterials.map((m) => m.aiTool).filter(Boolean))];
      const usage = interview.answers['ai-output-usage'];
      return {
        content: [
          `사용한 AI 도구: ${tools.length ? tools.join(', ') : '미확인'}`,
          `활용 자료: ${aiMaterials.length ? aiMaterials.map((m) => m.title).join(', ') : '미확인'}`,
          `산출물 활용 방식: ${usage ?? aiMaterials[0]?.description ?? '색상·배경 분위기를 참고하는 용도로만 활용했습니다.'}`,
        ].join('\n'),
        sources: aiMaterials.length ? ['user-statement', 'attachment'] : ['unverified'],
      };
    }

    case 'human-expression': {
      const edits = interview.answers['human-edits'];
      const details = manualMaterials.map((m) => `- ${m.title}: ${m.description}`);
      return {
        content: [edits ?? DEFAULT_HUMAN_EXPRESSION, ...details].join('\n'),
        sources: manualMaterials.length ? ['user-statement', 'attachment'] : ['user-statement'],
      };
    }

    case 'references': {
      const timeline = buildContributionTimeline(materials, finalWork);
      return {
        content: timeline.length
          ? timeline
              .map(
                (item, i) =>
                  `${String(i + 1).padStart(2, '0')} ${STEP_KIND_LABEL[item.kind]} · ${item.title}${
                    item.fileNames[0] ? ` (${item.fileNames[0]})` : ''
                  }`,
              )
              .join('\n')
          : '연결된 창작 과정 자료가 없어요.',
        sources: timeline.length ? ['attachment'] : ['unverified'],
      };
    }

    case 'supplement': {
      const todo = [
        !interview.answers['human-edits'] && '직접 수정 과정의 구체적인 차이 설명 추가 필요',
        !finalWork && '최종 작품 이미지·설명 등록 필요',
        !aiMaterials.length && 'AI 활용 자료 연결 필요',
      ].filter(Boolean) as string[];
      return {
        content: todo.length
          ? todo.map((t) => `- ${t}`).join('\n')
          : '추가로 확인이 필요한 항목이 없어요.',
        sources: todo.length ? ['unverified'] : ['user-statement'],
      };
    }
  }
}

/**
 * Copyright Brief 생성 (목업)
 * 업데이트일 때는 직전 리포트에서 사용자가 직접 수정한 섹션을 그대로 유지
 */
export function buildMockBrief(data: BriefSourceData, previous?: BriefReport): BriefReport {
  const sections = BRIEF_SECTION_KEYS.map((key): BriefSection => {
    const edited = previous?.sections.find((s) => s.key === key && s.userEditedAt);
    if (edited) return edited;

    const meta = BRIEF_SECTION_META[key];
    return { key, title: meta.title, summary: meta.summary, ...buildSectionContent(key, data) };
  });

  return {
    version: (previous?.version ?? 0) + 1,
    generatedAt: new Date().toISOString(),
    sections,
  };
}
