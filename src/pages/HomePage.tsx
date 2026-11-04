import styled from 'styled-components';
import { colors } from '../styles/theme';

export default function HomePage() {
  return (
    <Wrap>
      <h1>프로젝트 대시보드</h1>
      <p>여기에 프로젝트 목록이 들어올 예정이에요.</p>
    </Wrap>
  );
}

const Wrap = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: ${colors.text};

  p {
    margin: 0;
    color: ${colors.muted};
  }
`;