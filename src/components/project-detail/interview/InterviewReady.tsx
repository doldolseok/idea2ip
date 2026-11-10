import styled from 'styled-components';
import {
  Caption,
  InfoRow,
  NoteBox,
  Panel,
  PanelTitle,
  Pill,
  RowDesc,
  RowLabel,
  RowList,
  RowText,
} from './interview.styles';
import { useFinalWork, useProjectMaterials } from '../../../store/projectStore';
import type { BriefField } from '../../../types/interview';
import { getMaterialReadiness } from '../../../utils/interview';
import { colors } from '../../../styles/theme';

interface Props {
  projectId: string;
  fields: BriefField[];
  onStart: () => void;
  /** "제작 과정에서 자료 추가 →" → 제작 과정 탭 */
  onGoToProcess: () => void;
}

// AI 인터뷰 탭 시작 전 화면
// - 필수 자료 3개 모두 준비됨: 1번 (AI 인터뷰 시작 활성)
// - 하나라도 없음: 2번 (안내 + 제작 과정 이동 버튼, 시작 비활성)

export default function InterviewReady({ projectId, fields, onStart, onGoToProcess }: Props) {
  const finalWork = useFinalWork(projectId);
  const materials = useProjectMaterials(projectId);
  const readiness = getMaterialReadiness(!!finalWork, materials);
  const isReady = readiness.every((item) => item.ready);

  const doneCount = fields.filter((f) => f.status === 'done').length;
  const needsWorkCount = fields.length - doneCount;

  return (
    <Section>
      <Header>
        <HeaderCopy>
          <Title>AI 인터뷰</Title>
          <Subtitle>필수 자료가 준비되면 부족한 정보 중심으로 맞춤 질문을 생성해요.</Subtitle>
        </HeaderCopy>
        <HeaderAside>인터뷰 시작 전 확인</HeaderAside>
      </Header>

      <Cards>
        <Panel $ratio={600}>
          <PanelTop>
            <PanelTitle>Copyright Brief 필드 상태</PanelTitle>
            <SummaryChips>
              <Pill $tone="positive" $width={60}>
                완료 {doneCount}
              </Pill>
              <Pill $tone="neutral" $width={60}>
                보완 {needsWorkCount}
              </Pill>
            </SummaryChips>
          </PanelTop>
          <Caption>입력 여부가 아니라, 설명이 충분한지 기준으로 질문 대상을 정해요.</Caption>
          <RowList $gap={6} $minHeight={290}>
            {fields.map((field) => (
              <InfoRow key={field.key} $height={50}>
                <RowText>
                  <RowLabel>{field.label}</RowLabel>
                  <RowDesc>{field.summary}</RowDesc>
                </RowText>
                {field.status === 'done' ? (
                  <Pill $tone="positive" $width={58}>
                    완료
                  </Pill>
                ) : (
                  <Pill $tone="neutral" $width={72}>
                    보완 필요
                  </Pill>
                )}
              </InfoRow>
            ))}
          </RowList>
          <LogicNote>
            <p>질문 생성 대상: 미입력 + 보완 필요 필드</p>
            <p>기존 답변이 충분한 필드는 다시 묻지 않아요.</p>
          </LogicNote>
        </Panel>

        <Panel $ratio={402}>
          <PanelTitle>필수 자료 준비 상태</PanelTitle>
          <Caption>질문 생성에 필요한 자료 연결 상태를 확인해요.</Caption>
          <RowList $gap={8} $minHeight={214}>
            {readiness.map((item) => (
              <InfoRow key={item.key} $height={62}>
                <RowText>
                  <RowLabel>{item.label}</RowLabel>
                  <RowDesc>{item.ready ? item.readyDesc : '자료 없음'}</RowDesc>
                </RowText>
                {item.ready ? (
                  <Pill $tone="positive" $width={64}>
                    준비됨
                  </Pill>
                ) : (
                  <Pill $tone="neutral" $width={54}>
                    필요
                  </Pill>
                )}
              </InfoRow>
            ))}
          </RowList>

          {!isReady && (
            <PrincipleNote>
              <p>AI는 이미지 자체만으로 창작 기여를 확정하지 않아요.</p>
              <p>최종 작품·제작 과정·기존 답변·Brief 필드를 함께 참고합니다.</p>
            </PrincipleNote>
          )}

          <Actions>
            {!isReady && (
              <AddMaterialButton type="button" onClick={onGoToProcess}>
                제작 과정에서 자료 추가 →
              </AddMaterialButton>
            )}
            <StartButton type="button" disabled={!isReady} onClick={onStart}>
              AI 인터뷰 시작
            </StartButton>
          </Actions>
        </Panel>
      </Cards>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 19px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 64px;
`;

const HeaderCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h2`
  margin: 0;
  color: ${colors.text};
  font-size: 24px;
  font-weight: 700;
  line-height: 30px;
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${colors.textHint};
  font-size: 12px;
  line-height: 18px;
`;

const HeaderAside = styled.p`
  flex-shrink: 0;
  margin: 0;
  color: ${colors.textHint};
  font-size: 10px;
  font-weight: 500;
  line-height: 14px;
`;

const Cards = styled.div`
  display: flex;
  align-items: stretch;
  gap: 18px;
`;

const PanelTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 34px;
`;

const SummaryChips = styled.div`
  display: flex;
  gap: 6px;
`;

const LogicNote = styled(NoteBox)`
  min-height: 60px;
`;

const PrincipleNote = styled(NoteBox)`
  padding: 10px;
  border-radius: 9px;
`;

/* Figma: 버튼 영역 높이 78px, 버튼은 아래 정렬 */
const Actions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 8px;
  min-height: 78px;
`;

const ActionButton = styled.button`
  width: 100%;
  height: 34px;
  font-size: 10px;
  font-weight: 500;
  line-height: 15px;
  border-radius: 9px;
  cursor: pointer;
  transition: background 0.15s;
`;

const AddMaterialButton = styled(ActionButton)`
  color: ${colors.primary};
  background: ${colors.card};
  border: 1px solid ${colors.softBlueBorder};

  &:hover {
    background: ${colors.softBlueBg};
  }
`;

/* 준비됨: 파란 버튼(38px) / 자료 부족: 회색 비활성(34px) */
const StartButton = styled(ActionButton)`
  height: 38px;
  color: #fff;
  background: ${colors.primary};
  border: 0;

  &:hover:not(:disabled) {
    background: ${colors.primaryHover};
  }

  &:disabled {
    height: 34px;
    color: ${colors.disabledText};
    background: ${colors.rowBg};
    cursor: not-allowed;
  }
`;
