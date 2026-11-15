import { useState } from 'react';
import styled from 'styled-components';
import SectionHeader from '../SectionHeader';
import ContributionStepModal from './ContributionStepModal';
import ContributionReviewModal from './ContributionReviewModal';
import ContributionGenerationPanel from './ContributionGenerationPanel';
import { useContributions } from '../../../hooks/useContributions';
import type { ProjectTabKey } from '../../../constants/projectTabs';
import StatusMessage, { StatusButton } from '../../StatusMessage';
import { Pill } from '../interview/interview.styles';
import { formatStepNumber } from '../../../utils/contribution';
import { colors, media } from '../../../styles/theme';
import { CONTRIBUTION_KIND_LABELS, CONTRIBUTION_REVIEW_LABELS, CONTRIBUTION_STEP_REVIEW_LABELS } from './contributionLabels';

// 프로젝트 상세 > "창작 기여 정리" 탭 (Figma 1-1778: 작업 과정 타임라인, 1-1881: 단계 상세 패널)
// 서버의 기여 단계 목록을 타임라인으로 보여주고, 단계를 누르면 오른쪽 상세 패널
// 검토(수정·제외·확정), 후보 생성, 전체 확정은 디자인에 없어 기존 보조 버튼 스타일로 타임라인 카드 위쪽에 둠

export default function ContributionTab({ projectId, onChangeTab }: { projectId: string; onChangeTab: (tab: ProjectTabKey) => void }) {
  const { data, error, loading, refreshing, refresh, applyReview } = useContributions(projectId);
  const [review, setReview] = useState<{ stepId: number | null; revision: number } | null>(null);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  const header = (
    <SectionHeader
      size="lg"
      title="창작 기여 구조화"
      subtitle="작업 과정을 타임라인으로 확인하고, 필요한 단계만 열어 자세히 볼 수 있어요."
    />
  );

  if (loading) return <Section>{header}<StatusMessage message="기여 목록을 불러오는 중입니다." /></Section>;

  const timeline = data?.timeline ?? [];
  const selectedIndex = timeline.findIndex((step) => step.stepId === selectedStep);
  const selected = timeline[selectedIndex];

  return (
    <Section>
      {header}
      {error && (
        <StatusMessage role="alert" message={error}
          action={<StatusButton type="button" disabled={refreshing} onClick={refresh}>다시 시도</StatusButton>} />
      )}

      <TimelineCard>
        <CardHead>
          <CardTitleGroup>
            <CardTitle>작업 과정 타임라인</CardTitle>
            {data && (
              <Pill $tone={data.reviewStatus === 'CONFIRMED' ? 'positive' : 'neutral'} $width={64}>
                {CONTRIBUTION_REVIEW_LABELS[data.reviewStatus]}
              </Pill>
            )}
          </CardTitleGroup>
          {data && (
            <Toolbar>
              <ContributionGenerationPanel projectId={projectId} expectedRevision={!error && !refreshing ? data.revision : undefined}
                latestGeneration={data.latestGeneration} onRefresh={refresh} />
              <ToolbarButtons>
                <StatusButton type="button" disabled={refreshing} onClick={refresh}>목록 새로고침</StatusButton>
                <StatusButton type="button" disabled={refreshing || !!error} onClick={() => setReview({ stepId: null, revision: data.revision })}>
                  전체 검토 확정
                </StatusButton>
              </ToolbarButtons>
            </Toolbar>
          )}
        </CardHead>

        {!!data?.unresolvedFields.length && (
          <Unresolved>
            <strong>확인이 필요한 항목</strong>
            <span>{data.unresolvedFields.join(' · ')}</span>
          </Unresolved>
        )}

        {data && !timeline.length ? (
          <Empty>아직 기여 단계가 없어요. 인터뷰를 마친 뒤 기여 후보를 생성해 주세요.</Empty>
        ) : (
          <Rows>
            {timeline.map((step, index) => (
              <li key={step.stepId}>
                <Row
                  type="button"
                  $selected={step.stepId === selectedStep}
                  aria-pressed={step.stepId === selectedStep}
                  onClick={() => setSelectedStep(step.stepId)}
                >
                  <RowLeft>
                    <Number>{formatStepNumber(index)}</Number>
                    <RowText>
                      <RowTitle>{step.title}</RowTitle>
                      <RowMeta>{`${CONTRIBUTION_KIND_LABELS[step.kind]}  ·  ${CONTRIBUTION_STEP_REVIEW_LABELS[step.reviewStatus]}`}</RowMeta>
                    </RowText>
                  </RowLeft>
                  <Chevron aria-hidden="true">›</Chevron>
                </Row>
              </li>
            ))}
          </Rows>
        )}
      </TimelineCard>

      {selected && (
        <ContributionStepModal
          key={`${projectId}/${selected.stepId}/${data?.revision}`}
          projectId={projectId}
          stepId={selected.stepId}
          index={selectedIndex}
          total={timeline.length}
          title={selected.title}
          kind={selected.kind}
          extra={data && (
            <StatusButton type="button" disabled={refreshing || !!error}
              onClick={() => setReview({ stepId: selected.stepId, revision: data.revision })}>
              검토하기 (수정·제외·확정)
            </StatusButton>
          )}
          onClose={() => setSelectedStep(null)}
          onMove={(next) => setSelectedStep(timeline[next].stepId)}
          onViewProcess={() => onChangeTab('process')}
        />
      )}
      {review && (
        <ContributionReviewModal projectId={projectId} revision={review.revision} stepId={review.stepId}
          onClose={() => setReview(null)} onSaved={(next) => { applyReview(next); setReview(null); }} />
      )}
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const TimelineCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 464px;
  padding: 18px;

  ${media.tablet} {
    min-height: 0;
  }

  ${media.mobile} {
    padding: 14px;
  }

  background: ${colors.card};
  border: 1px solid ${colors.contributionBorder};
  border-radius: 14px;
`;

const CardHead = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const CardTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 34px;
`;

const CardTitle = styled.h3`
  margin: 0;
  color: ${colors.textStrong};
  font-size: 14px;
  font-weight: 600;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 8px;
`;

const ToolbarButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Unresolved = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 14px;
  font-size: 12px;
  line-height: 1.4;
  background: ${colors.chipPositiveBg};
  border-radius: 10px;

  strong {
    color: ${colors.primary};
    font-weight: 600;
  }

  span {
    color: ${colors.contributionMuted};
  }
`;

const Empty = styled.p`
  margin: auto 0;
  padding: 40px 0;
  color: ${colors.contributionMuted};
  font-size: 14px;
  text-align: center;
`;

const Rows = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Row = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 84px;
  padding: 0 14px;
  text-align: left;

  ${media.mobile} {
    height: 72px;
    padding: 0 10px;
  }

  background: ${({ $selected }) => ($selected ? colors.chipPositiveBg : colors.card)};
  border: 1px solid ${colors.contributionBorder};
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${({ $selected }) => ($selected ? colors.chipPositiveBg : colors.bg)};
  }
`;

const RowLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
`;

const Number = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 46px;
  height: 46px;
  color: ${colors.primary};
  font-size: 13px;
  font-weight: 600;
  background: ${colors.chipPositiveBg};
  border-radius: 12px;
`;

const RowText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  line-height: normal;
`;

const RowTitle = styled.span`
  overflow: hidden;
  color: ${colors.textStrong};
  font-size: 14px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RowMeta = styled.span`
  overflow: hidden;
  color: ${colors.contributionMuted};
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: pre;
`;

const Chevron = styled.span`
  flex-shrink: 0;
  width: 22px;
  color: ${colors.chevron};
  font-size: 20px;
  font-weight: 500;
  text-align: center;
`;
