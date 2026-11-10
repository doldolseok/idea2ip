import styled from 'styled-components';
import DetailCard from './DetailCard';
import { colors } from '../../styles/theme';

// 아직 디자인이 없는 탭의 빈 자리 (탭별 컴포넌트가 생기면 ProjectDetailPage의 TAB_CONTENT에서 교체)

export default function TabPlaceholder({ label }: { label: string }) {
  return (
    <Card>
      <Text>{label} 화면은 준비 중이에요.</Text>
    </Card>
  );
}

const Card = styled(DetailCard)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 320px;
`;

const Text = styled.p`
  margin: 0;
  color: ${colors.textMuted};
  font-size: 16px;
  font-weight: 500;
`;
