import styled from 'styled-components';
import ReportHeader from './ReportHeader';
import {
  BlueButton,
  InfoNote,
  ListRow,
  NumberBox,
  ReportCard,
  RowDesc,
  RowLeft,
  RowText,
  RowTitle,
} from './report.styles';
import { Pill } from '../interview/interview.styles';
import { MOCK_BRIEF_READINESS } from '../../../mocks/brief';
import { colors } from '../../../styles/theme';

// 리포트 탭 1번: 생성 전 (정보 확인 목록은 시안 값 그대로 목업, 미확인이 있어도 생성 가능)

export default function BriefReady({ onGenerate }: { onGenerate: () => void }) {
  const { writtenCount, unverifiedCount, items } = MOCK_BRIEF_READINESS;

  return (
    <>
      <ReportHeader
        title="Copyright Brief 생성"
        subtitle="필수 정보 상태를 확인하고 등록 준비 설명 초안을 생성하세요."
        meta={['생성 전 확인', '프로젝트 자동 저장']}
      />

      <Card>
        <Top>
          <div>
            <CardTitle>생성 전 정보 확인</CardTitle>
            <CardDesc>
              작성 상태는 정보 충족 여부이며, 법적 요건 충족 여부를 의미하지 않아요.
            </CardDesc>
          </div>
          <Counts>
            <Pill $tone="positive" $width={82}>
              작성됨 {writtenCount}
            </Pill>
            <Pill $tone="neutral" $width={72}>
              미확인 {unverifiedCount}
            </Pill>
          </Counts>
        </Top>

        <List>
          {items.map((item) => (
            <li key={item.no}>
              <ListRow $height={60}>
                <RowLeft>
                  <NumberBox>{item.no}</NumberBox>
                  <RowText>
                    <RowTitle>{item.title}</RowTitle>
                    <RowDesc>{item.desc}</RowDesc>
                  </RowText>
                </RowLeft>
                {item.status === 'written' ? (
                  <Pill $tone="positive" $width={62}>
                    작성됨
                  </Pill>
                ) : (
                  <Pill $tone="neutral" $width={72}>
                    미확인 {'count' in item ? item.count : ''}
                  </Pill>
                )}
              </ListRow>
            </li>
          ))}
        </List>

        <Note>
          <InfoNote>
            <p>미확인 정보는 임의로 작성하지 않아요.</p>
            <p>부족한 내용은 Copyright Brief의 ‘추가 확인 및 보완사항’에 그대로 남겨요.</p>
          </InfoNote>
          <GenerateButton type="button" onClick={onGenerate}>
            Copyright Brief 생성
          </GenerateButton>
        </Note>
      </Card>
    </>
  );
}

const Card = styled(ReportCard)`
  gap: 12px;
  padding: 18px;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 58px;
`;

const CardTitle = styled.h3`
  margin: 0 0 3px;
  color: ${colors.textStrong};
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
`;

const CardDesc = styled.p`
  margin: 0;
  color: ${colors.contributionMuted};
  font-size: 10px;
  line-height: 15px;
`;

const Counts = styled.div`
  display: flex;
  gap: 10px;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Note = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 52px;
  padding: 0 10px 0 12px;
  background: ${colors.softBlueBg};
  border-radius: 10px;
`;

const GenerateButton = styled(BlueButton)`
  width: 220px;
`;
