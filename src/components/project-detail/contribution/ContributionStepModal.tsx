import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getContributionStep } from '../../../api/contributions';
import type { ContributionStepDetail } from '../../../api/contributions';
import ContributionDrawer from './ContributionDrawer';
import type { ContributionDrawerView } from './ContributionDrawer';
import StatusMessage, { StatusButton } from '../../StatusMessage';
import type { EvidenceKind } from '../../../types/contribution';
import { CONTRIBUTION_KIND_LABELS, CONTRIBUTION_STEP_REVIEW_LABELS } from './contributionLabels';

interface Props {
  projectId: string;
  stepId: number;
  /** 타임라인 목록 기준 위치 (이전/다음 단계 이동) */
  index: number;
  total: number;
  title: string;
  kind: ContributionStepDetail['kind'];
  extra?: ReactNode;
  onClose: () => void;
  onMove: (index: number) => void;
  onViewProcess: () => void;
}

const SOURCE_METADATA = { edition: '판본', effectiveFrom: '시행 시작일', effectiveTo: '시행 종료일', publisher: '발행처', publishedOn: '발행일', retrievedOn: '조회일' } as const;

/** 서버 단계 상세 → 패널 표시 내용 */
function toView(data: ContributionStepDetail): ContributionDrawerView {
  const ai = data.aiUsage;
  const aiUsage = ai
    ? [
        `사용 도구: ${ai.tools.join(', ') || '미입력'}`,
        `활용 목적: ${ai.purpose || '미입력'}`,
        `결과 활용: ${ai.outputUsage || '미입력'}`,
      ]
    : ['AI 활용 정보 없음'];
  const human = [...data.humanCreatedElements, ...data.humanEdits.map((text) => `수정: ${text}`)];
  return {
    kindLabel: CONTRIBUTION_KIND_LABELS[data.kind],
    title: `${data.order}. ${data.title}`,
    meta: `${CONTRIBUTION_KIND_LABELS[data.kind]} · ${CONTRIBUTION_STEP_REVIEW_LABELS[data.reviewStatus]}`,
    description: `${CONTRIBUTION_KIND_LABELS[data.kind]} 단계예요. 연결 자료와 인터뷰 답변을 근거로 정리했어요.`,
    fileNames: [
      ...data.materialRefs.flatMap((ref) => ref.files.length ? ref.files.map((file) => file.originalFileName) : [`${ref.title} (첨부 이미지 없음)`]),
      ...(data.finalArtworkRef ? [`${data.finalArtworkRef.title} (최종 작품${data.finalArtworkRef.fileUrl ? '' : ', 첨부 이미지 없음'})`] : []),
    ],
    aiUsage,
    humanContribution: human.length ? human : ['정보 없음'],
    evidence: data.sources.map((source) => {
      const kind: EvidenceKind = source.kind === 'USER_STATEMENT' ? 'user-statement' : 'attachment';
      const metadata = (Object.keys(SOURCE_METADATA) as (keyof typeof SOURCE_METADATA)[])
        .filter((key) => source[key]).map((key) => `${SOURCE_METADATA[key]} ${source[key]}`);
      return {
        kind,
        source: [source.title, source.locator].filter(Boolean).join(' · '),
        detail: [source.quote, ...metadata].filter(Boolean).join('\n') || undefined,
        href: source.officialUrl && /^https?:\/\//i.test(source.officialUrl) ? source.officialUrl : undefined,
      };
    }),
  };
}

// 창작 기여 단계 상세 (오른쪽 패널, Figma 1-1881)

export default function ContributionStepModal({ projectId, stepId, index, total, title, kind, extra, onClose, onMove, onViewProcess }: Props) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ attempt: number; data?: ContributionStepDetail; error?: string }>();
  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem('accessToken');
    getContributionStep(projectId, stepId, controller.signal).then((data) => {
      if (controller.signal.aborted) return;
      if (localStorage.getItem('accessToken') !== token) throw new Error('로그인 상태가 변경되었습니다. 다시 로그인해주세요.');
      setResult({ attempt, data });
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setResult({ attempt, error: error instanceof Error ? error.message : '단계 조회에 실패했습니다.' });
    });
    return () => controller.abort();
  }, [projectId, stepId, attempt]);
  const current = result?.attempt === attempt ? result : undefined;
  const data = current?.data;
  return (
    <ContributionDrawer
      index={index}
      total={total}
      title={title}
      kindLabel={CONTRIBUTION_KIND_LABELS[kind]}
      view={data ? toView(data) : undefined}
      status={!current ? <StatusMessage message="단계 정보를 불러오는 중입니다." /> : current.error ? (
        <StatusMessage role="alert" message={current.error}
          action={<StatusButton type="button" onClick={() => setAttempt((value) => value + 1)}>다시 시도</StatusButton>} />
      ) : null}
      extra={extra}
      onClose={onClose}
      onMove={onMove}
      onViewProcess={onViewProcess}
    />
  );
}
