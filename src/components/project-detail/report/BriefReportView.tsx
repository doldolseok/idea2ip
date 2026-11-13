import styled from 'styled-components';
import ReportHeader from './ReportHeader';
import {
  BlueButton,
  InfoNote,
  ListRow,
  NumberBox,
  OutlineBlueButton,
  ReportCard,
  RowDesc,
  RowLeft,
  RowText,
  RowTitle,
} from './report.styles';
import EvidenceTag from '../EvidenceTag';
import { Pill } from '../interview/interview.styles';
import { EVIDENCE_KINDS } from '../../../constants/evidence';
import { BRIEF_SECTION_META } from '../../../mocks/brief';
import type { BriefReport, BriefSectionKey } from '../../../types/brief';
import { colors, media } from '../../../styles/theme';

interface Props {
  report: BriefReport;
  /** 업데이트 배너 두 번째 줄의 새 정보 문구 (없으면 배너 숨김) */
  newInfoText: string;
  onUpdate: () => void;
  onEdit: (key: BriefSectionKey) => void;
  onOpenPdf: () => void;
}

// 리포트 탭 3번: 생성된 Copyright Brief (+ 6번: 새 정보가 있으면 위에 업데이트 배너)

export default function BriefReportView({
  report,
  newInfoText,
  onUpdate,
  onEdit,
  onOpenPdf,
}: Props) {
  return (
    <>
      <ReportHeader
        title="Copyright Brief"
        subtitle="등록 준비 항목을 확인하고, 필요한 내용은 직접 수정할 수 있어요."
        meta={[`Copyright Brief v${report.version}`, '프로젝트 자동 저장 · 사용자 수정 내용 보존']}
      />

      {newInfoText && (
        <Banner role="status">
          <InfoNote>
            <p>새로운 정보가 추가되어 리포트를 업데이트할 수 있어요.</p>
            <p>{`${newInfoText}  /  기존 v${report.version}과 사용자 수정 내용은 유지됩니다.`}</p>
          </InfoNote>
          <UpdateButton type="button" onClick={onUpdate}>
            리포트 업데이트
          </UpdateButton>
        </Banner>
      )}

      <Card>
        <Top>
          <div>
            <CardTitle>저작권 등록 준비 리포트</CardTitle>
            <CardDesc>항목별 설명과 출처를 함께 확인해요.</CardDesc>
          </div>
          <Actions>
            <EditButton type="button" onClick={() => onEdit(report.sections[0].key)}>
              내용 직접 편집
            </EditButton>
            <PdfButton type="button" onClick={onOpenPdf}>
              PDF 저장
            </PdfButton>
          </Actions>
        </Top>

        <Legend>
          <LegendLabel>출처 태그</LegendLabel>
          {EVIDENCE_KINDS.map((kind) => (
            <EvidenceTag key={kind} kind={kind} />
          ))}
          <Preserve>v{report.version} · 사용자 직접 수정 내용은 AI 갱신 시 덮어쓰지 않음</Preserve>
        </Legend>

        <List>
          {report.sections.map((section) => (
            <li key={section.key}>
              <RowButton as="button" type="button" $height={50} onClick={() => onEdit(section.key)}>
                <RowLeft>
                  <NumberBox>{BRIEF_SECTION_META[section.key].no}</NumberBox>
                  <RowText>
                    <RowTitle>{section.title}</RowTitle>
                    <RowDesc>{section.summary}</RowDesc>
                  </RowText>
                </RowLeft>
                <RowRight>
                  {section.userEditedAt && (
                    <Pill $tone="positive" $width={78}>
                      사용자 수정됨
                    </Pill>
                  )}
                  <Chevron aria-hidden="true">›</Chevron>
                </RowRight>
              </RowButton>
            </li>
          ))}
        </List>

        <Footer>
          <span>※ 정보가 부족한 항목은 임의로 채우지 않고 미확인 상태로 남겨요.</span>
          <span>법적 판단·등록 승인을 보장하지 않음</span>
        </Footer>
      </Card>
    </>
  );
}

const Banner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 56px;
  padding: 0 12px 0 16px;
  background: ${colors.chipPositiveBg};
  border-radius: 10px;

  ${media.mobile} {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    padding: 12px;
  }

  p:first-child {
    font-size: 11px;
    line-height: 16px;
  }
`;

const UpdateButton = styled(BlueButton)`
  width: 170px;

  ${media.mobile} {
    width: 100%;
  }
`;

/* Figma: 안쪽 여백 16 18 14, 요소 사이 10px */
const Card = styled(ReportCard)`
  gap: 10px;
  padding: 16px 18px 14px;
`;

const Top = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 16px;
`;

const CardTitle = styled.h3`
  margin: 0 0 2px;
  color: ${colors.textStrong};
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
`;

const CardDesc = styled.p`
  margin: 0;
  color: ${colors.contributionMuted};
  font-size: 10px;
  line-height: 14px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;

  ${media.mobile} {
    width: 100%;

    & > button {
      flex: 1;
      width: auto;
    }
  }
`;

const EditButton = styled(OutlineBlueButton)`
  width: 142px;
`;

const PdfButton = styled(BlueButton)`
  width: 112px;
`;

const Legend = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 28px;
`;

const LegendLabel = styled.span`
  width: 62px;
  color: ${colors.contributionMuted};
  font-size: 10px;
  font-weight: 500;
  line-height: 14px;
`;

const Preserve = styled.span`
  padding-left: 10px;
  max-width: 100%;
  overflow: hidden;

  ${media.mobile} {
    flex-basis: 100%;
    padding-left: 0;
    white-space: normal;
  }

  color: ${colors.contributionMuted};
  font-size: 10px;
  line-height: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const RowButton = styled(ListRow)`
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${colors.bg};
  }
`;

const RowRight = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

const Chevron = styled.span`
  width: 18px;
  color: ${colors.chevron};
  font-size: 18px;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 4px 16px;
  min-height: 32px;
  color: ${colors.contributionMuted};
  font-size: 9px;
  line-height: 14px;
`;
