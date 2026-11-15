import type { ReactNode } from 'react';
import styled from 'styled-components';
import ReportHeader from './ReportHeader';
import { BlueButton, InfoNote, NumberBox, ReportCard } from './report.styles';
import { Pill } from '../interview/interview.styles';
import { BRIEF_GENERATION_STEPS } from '../../../mocks/brief';
import type { GenerationStepStatus } from '../../../utils/brief';
import { colors, media } from '../../../styles/theme';
import type { ReportVersion } from '../../../api/reports';

const STATUS_CHIP: Record<
  GenerationStepStatus,
  { label: string; positive: boolean; width: number }
> = {
  done: { label: '완료', positive: true, width: 62 },
  'in-progress': { label: '진행 중', positive: true, width: 72 },
  waiting: { label: '대기', positive: false, width: 62 },
};

/** 서버 진행 단계 → 화면의 3단계 (입력 정리 / 출처 연결 / 초안 작성·PDF) */
const STAGE_INDEX: Record<NonNullable<ReportVersion['stage']>, number> = {
  COLLECTING_INPUT: 0,
  LINKING_SOURCES: 1,
  DRAFTING: 2,
  RENDERING_PDF: 2,
};

// 리포트 탭 2번: 생성 중 (서버 작업의 진행 단계로 표시)

export default function BriefGenerating({ stage, action }: {
  /** 서버 진행 단계 (null: 대기 중) */
  stage: ReportVersion['stage'] | undefined;
  /** 하단 버튼 자리 (같은 요청 상태 확인 등, 없으면 비활성 "리포트 생성 중…") */
  action?: ReactNode;
}) {
  const current = stage ? STAGE_INDEX[stage] : 0;
  const statuses: GenerationStepStatus[] = BRIEF_GENERATION_STEPS.map((_, i) =>
    i < current ? 'done' : i === current ? 'in-progress' : 'waiting',
  );

  return (
    <>
      <ReportHeader
        title="Copyright Brief 생성 중"
        subtitle="입력한 자료와 인터뷰 답변을 등록 준비 항목에 맞게 정리하고 있어요."
      />

      <Card aria-live="polite">
        <Steps>
          {BRIEF_GENERATION_STEPS.map((step, i) => {
            const status = statuses[i];
            const chip = STATUS_CHIP[status];
            return (
              <Step key={step.title}>
                <StepNumber $waiting={status === 'waiting'}>
                  {String(i + 1).padStart(2, '0')}
                </StepNumber>
                <StepText>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDesc>{step.desc}</StepDesc>
                </StepText>
                <Pill $tone={chip.positive ? 'positive' : 'neutral'} $width={chip.width}>
                  {chip.label}
                </Pill>
              </Step>
            );
          })}
        </Steps>

        <Note>
          <InfoNote>
            <p>정보가 부족한 항목은 추정하지 않습니다.</p>
            <p>미확인 내용은 보완사항으로 남기고, 생성이 완료되면 프로젝트에 자동 저장해요.</p>
          </InfoNote>
        </Note>

        <Footer>
          <FooterText>잠시 후 생성된 Copyright Brief를 확인할 수 있어요.</FooterText>
          {action ?? (
            <DisabledButton type="button" disabled>
              리포트 생성 중…
            </DisabledButton>
          )}
        </Footer>
      </Card>
    </>
  );
}

/* Figma: 안쪽 여백 28px 32px, 단계 목록 → 안내 박스 20px → 하단 11px */
const Card = styled(ReportCard)`
  padding: 28px 32px 14px;

  ${media.mobile} {
    padding: 16px 14px 14px;
  }
`;

const Steps = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Step = styled.li`
  display: flex;
  align-items: center;
  gap: 14px;
  height: 72px;

  ${media.mobile} {
    gap: 10px;
    height: auto;
    min-height: 72px;
  }
`;

const StepNumber = styled(NumberBox)<{ $waiting: boolean }>`
  width: 44px;
  height: 44px;
  font-size: 12px;
  line-height: 16px;
  border-radius: 12px;
  color: ${({ $waiting }) => ($waiting ? colors.contributionMuted : colors.primary)};
  background: ${({ $waiting }) => ($waiting ? colors.rowBg : colors.chipPositiveBg)};
`;

const StepText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
`;

const StepTitle = styled.p`
  margin: 0;
  color: ${colors.textStrong};
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
`;

const StepDesc = styled.p`
  margin: 0;
  color: ${colors.contributionMuted};
  font-size: 10px;
  line-height: 15px;
`;

const Note = styled.div`
  min-height: 92px;
  margin-top: 20px;
  padding: 14px 16px;
  background: ${colors.softBlueBg};
  border-radius: 10px;

  p:first-child {
    font-size: 11px;
    line-height: 16px;
    margin-bottom: 3px;
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 11px;

  ${media.mobile} {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
`;

const FooterText = styled.p`
  margin: 0;
  color: ${colors.contributionMuted};
  font-size: 10px;
  line-height: 15px;
`;

const DisabledButton = styled(BlueButton)`
  width: 190px;

  ${media.mobile} {
    width: 100%;
  }
`;
