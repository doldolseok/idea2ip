import { useState } from 'react';
import styled from 'styled-components';
import { Pill } from '../components/project-detail/interview/interview.styles';
import { GUIDE_STEPS } from '../constants/guide';
import { colors, media, pagePadding } from '../styles/theme';

// 사이드바 "사용 가이드" (/guide)
// 왼쪽 단계 목록에서 고른 단계의 안내와 자주 묻는 질문을 오른쪽에 표시 (선택 상태는 화면 안에서만)

export default function GuidePage() {
  const [selectedNo, setSelectedNo] = useState(GUIDE_STEPS[0].no);
  const step = GUIDE_STEPS.find((s) => s.no === selectedNo) ?? GUIDE_STEPS[0];

  return (
    <Page>
      <Header>
        <Title>사용 가이드</Title>
        <Subtitle>전체 이용 흐름과 자주 묻는 질문을 한 화면에서 확인해요</Subtitle>
      </Header>

      <Body>
        <StepNav aria-label="사용 가이드 단계">
          <StepList>
            {GUIDE_STEPS.map((s) => (
              <li key={s.no}>
                <StepButton
                  type="button"
                  aria-current={s.no === selectedNo ? 'step' : undefined}
                  $selected={s.no === selectedNo}
                  onClick={() => setSelectedNo(s.no)}
                >
                  {`${s.no}  ${s.navLabel}`}
                </StepButton>
              </li>
            ))}
          </StepList>
        </StepNav>

        <Content aria-live="polite">
          <StepIntro>
            <StepChip $tone="positive" $width={88}>
              STEP {step.no}
            </StepChip>
            <StepHeading>
              <StepTitle>{step.title}</StepTitle>
              <StepSubtitle>{step.subtitle}</StepSubtitle>
            </StepHeading>
          </StepIntro>

          <Points>
            {step.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </Points>

          <Faq>
            <FaqTitle>자주 묻는 질문</FaqTitle>
            {step.faqs.map((faq) => (
              <FaqItem key={faq.question}>
                <Question>Q. {faq.question}</Question>
                <Answer>{faq.answer}</Answer>
              </FaqItem>
            ))}
          </Faq>
        </Content>
      </Body>
    </Page>
  );
}

/* 제목 위 80px, 사이드바와 50px */
const Page = styled.div`
  ${pagePadding}
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Title = styled.h1`
  margin: 0;
  word-break: keep-all;
  color: ${colors.text};
  font-size: 28px;
  font-weight: 700;
  line-height: 1.4;
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${colors.muted};
  font-size: 14px;
  line-height: normal;
`;

/* Figma: 제목 영역 아래 52px, 단계 목록(250) ↔ 내용 카드 36px */
const Body = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 36px;
  margin-top: 52px;

  /* 태블릿 이하: 단계 목록 위, 내용 카드 아래로 쌓기 */
  ${media.tablet} {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
    margin-top: 32px;
  }
`;

const card = `
  background: ${colors.card};
  border: 1px solid ${colors.border};
  border-radius: 14px;
`;

const StepNav = styled.nav`
  ${card}
  flex: 0 0 250px;
  min-height: 610px;
  padding: 13px 11px;

  ${media.tablet} {
    flex: none;
    min-height: 0;
    padding: 8px;
  }
`;

const StepList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;

  /* 태블릿 이하: 단계 버튼을 가로로 나열하고 넘치면 가로 스크롤 */
  ${media.tablet} {
    flex-direction: row;
    gap: 8px;
    overflow-x: auto;
    scrollbar-width: none;

    li {
      flex-shrink: 0;
    }
  }
`;

const StepButton = styled.button<{ $selected: boolean }>`
  width: 100%;
  height: 48px;
  padding: 0 14px;
  color: ${({ $selected }) => ($selected ? colors.selected : colors.text)};
  font-size: 14px;
  font-weight: ${({ $selected }) => ($selected ? 700 : 400)};
  line-height: normal;
  text-align: left;
  white-space: pre;
  background: ${({ $selected }) => ($selected ? colors.selectedBg : 'transparent')};
  border: 0;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${({ $selected }) => ($selected ? colors.selectedBg : colors.bg)};
  }

  ${media.tablet} {
    width: auto;
    height: 44px;
  }
`;

/* 안쪽 여백 24px */
const Content = styled.section`
  ${card}
  flex: 1;
  min-width: 0;
  min-height: 597px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 24px;

  ${media.tablet} {
    min-height: 0;
  }

  ${media.mobile} {
    padding: 20px 16px;
  }
`;

const StepIntro = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 31px;
`;

/* STEP 칩: 기존 Pill에 Figma 크기(28px, 12px)와 색(#ECF1FF / #3063ED)만 맞춤 */
const StepChip = styled(Pill)`
  height: 28px;
  color: ${colors.selected};
  font-size: 12px;
  line-height: normal;
  background: ${colors.selectedBg};
  border-radius: 14px;
`;

const StepHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  line-height: normal;
`;

const StepTitle = styled.h2`
  margin: 0;
  color: #000;
  font-size: 24px;
  font-weight: 700;
`;

const StepSubtitle = styled.p`
  margin: 0;
  color: ${colors.guideMuted};
  font-size: 14px;
`;

/* 안내 항목 박스: 제목 영역 아래 30px (Content gap 22 + 8) */
const Points = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 8px 0 0;
  padding: 14px 12px 14px 33px;
  color: ${colors.guideText};
  font-size: 14px;
  line-height: normal;
  background: #f8fafd;
  border: 1px solid rgba(219, 227, 240, 0.3);
  border-radius: 14px;
  list-style: disc;
`;

const Faq = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FaqTitle = styled.h3`
  margin: 0;
  color: ${colors.guideMuted};
  font-size: 15px;
  font-weight: 400;
  line-height: normal;
`;

const FaqItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 16px;
  color: ${colors.guideText};
  font-size: 14px;
  line-height: normal;
  border: 1px solid ${colors.border};
  border-radius: 14px;
`;

const Question = styled.p`
  margin: 0;
  font-weight: 500;
`;

const Answer = styled.p`
  margin: 0;
  word-break: keep-all;
`;
