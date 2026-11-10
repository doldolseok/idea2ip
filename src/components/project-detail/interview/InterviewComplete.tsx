import styled from 'styled-components';
import checkIcon from '../../../assets/interview-check-circle.svg';
import SectionHeader from '../SectionHeader';
import { SubmitButton } from '../../modal/modalForm.styles';
import { colors } from '../../../styles/theme';

// AI 인터뷰 탭 4번: 인터뷰 완료

export default function InterviewComplete({ onNext }: { onNext: () => void }) {
  return (
    <Section>
      <SectionHeader
        title="AI 인터뷰를 마쳤어요"
        subtitle="창작 과정에 대한 답변이 프로젝트에 저장되었습니다."
      />
      <Box>
        <Message>
          <img src={checkIcon} alt="" width={60} height={60} />
          <Texts>
            <Heading>이제 나의 창작 기록을 확인해 보세요</Heading>
            <Body>AI가 인터뷰 답변과 제작 과정 자료를 바탕으로 창작 내용을 정리했습니다.</Body>
          </Texts>
        </Message>
        <NextButton type="button" onClick={onNext}>
          창작 기록 확인하기
        </NextButton>
      </Box>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

/* Figma: 가로 가운데 679 × 330 영역, 배경은 페이지와 같은 색 */
const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  width: 100%;
  max-width: 679px;
  min-height: 330px;
  margin: 0 auto;
  padding: 18px 20px 0;
  background: ${colors.bg};
  border-radius: 18px;
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;

  img {
    display: block;
  }
`;

const Texts = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  line-height: normal;
  text-align: center;
`;

const Heading = styled.p`
  margin: 0;
  color: ${colors.textStrong};
  font-size: 22px;
  font-weight: 600;
`;

const Body = styled.p`
  margin: 0;
  color: ${colors.textSecondary};
  font-size: 18px;
  font-weight: 500;
`;

const NextButton = styled(SubmitButton)`
  width: 241px;
  font-size: 16px;
  font-weight: 500;
`;
