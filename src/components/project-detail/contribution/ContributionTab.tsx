import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import ContributionDrawer from './ContributionDrawer';
import SectionHeader from '../SectionHeader';
import TabPlaceholder from '../TabPlaceholder';
import { buildMockContribution } from '../../../mocks/contribution';
import { useFinalWork, useProjectMaterials } from '../../../store/projectStore';
import type { ProjectTabKey } from '../../../constants/projectTabs';
import { buildContributionTimeline, formatStepNumber } from '../../../utils/contribution';
import { formatDate, formatTime } from '../../../utils/formatDate';
import { colors } from '../../../styles/theme';

interface Props {
  projectId: string;
  onChangeTab: (tab: ProjectTabKey) => void;
}

// 프로젝트 상세 > "창작 기여 정리" 탭 (창작적 기여 구조화)
// 제작 자료 + 최종 작품을 등록 시각 순 타임라인으로 보여주고, 단계를 누르면 오른쪽 상세 패널

export default function ContributionTab({ projectId, onChangeTab }: Props) {
  const materials = useProjectMaterials(projectId);
  const finalWork = useFinalWork(projectId);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const items = useMemo(
    () => buildContributionTimeline(materials, finalWork),
    [materials, finalWork],
  );
  // TODO: 구조화 API 연동 시 서버 응답으로 교체
  const result = useMemo(() => buildMockContribution(projectId, items), [projectId, items]);

  const closeDrawer = useCallback(() => setSelectedId(null), []);

  const header = (
    <SectionHeader
      size="lg"
      title="창작 기여 구조화"
      subtitle="작업 과정을 타임라인으로 확인하고, 필요한 단계만 열어 자세히 볼 수 있어요."
    />
  );

  if (items.length === 0) {
    return (
      <Section>
        {header}
        <TabPlaceholder message="등록된 제작 자료나 최종 작품이 없어요." />
      </Section>
    );
  }

  const selectedIndex = items.findIndex((item) => item.id === selectedId);
  const selectedItem = items[selectedIndex];
  const selectedStep = result.steps.find((step) => step.stepId === selectedId);

  return (
    <Section>
      {header}

      <TimelineCard>
        <CardTitle>작업 과정 타임라인</CardTitle>
        <Rows>
          {items.map((item, index) => {
            const step = result.steps[index];
            return (
              <li key={item.id}>
                <Row
                  type="button"
                  $selected={item.id === selectedId}
                  aria-pressed={item.id === selectedId}
                  onClick={() => setSelectedId(item.id)}
                >
                  <RowLeft>
                    <Number>{formatStepNumber(index)}</Number>
                    <RowText>
                      <RowTitle>{item.title}</RowTitle>
                      <RowMeta>
                        {`${step.summary}  ·  ${formatDate(item.registeredAt)} · ${formatTime(item.registeredAt)}`}
                      </RowMeta>
                    </RowText>
                  </RowLeft>
                  <Chevron aria-hidden="true">›</Chevron>
                </Row>
              </li>
            );
          })}
        </Rows>
      </TimelineCard>

      {selectedItem && selectedStep && (
        <ContributionDrawer
          item={selectedItem}
          step={selectedStep}
          index={selectedIndex}
          total={items.length}
          onClose={closeDrawer}
          onMove={(index) => setSelectedId(items[index].id)}
          onViewProcess={() => onChangeTab('process')}
        />
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
  background: ${colors.card};
  border: 1px solid ${colors.contributionBorder};
  border-radius: 14px;
`;

const CardTitle = styled.h3`
  display: flex;
  align-items: center;
  height: 34px;
  margin: 0;
  color: ${colors.textStrong};
  font-size: 14px;
  font-weight: 600;
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
  color: ${colors.textStrong};
  font-size: 14px;
  font-weight: 600;
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
