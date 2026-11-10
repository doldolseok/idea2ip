import styled from 'styled-components';
import { colors } from '../../styles/theme';

/** 탭 내용 위쪽 섹션 제목 + 부제 (최종 작품, AI 인터뷰 진행/완료 화면 공통) */
export default function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Header>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
    </Header>
  );
}

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Title = styled.h2`
  margin: 0;
  color: ${colors.textStrong};
  font-size: 22px;
  font-weight: 600;
  line-height: normal;
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${colors.textSecondary};
  font-size: 14px;
  line-height: 1.4;
`;
