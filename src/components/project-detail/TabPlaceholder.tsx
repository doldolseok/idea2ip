import styled from 'styled-components';
import DetailCard from './DetailCard';
import { colors } from '../../styles/theme';

// 아직 디자인이 없는 탭의 빈 자리 (탭별 컴포넌트가 생기면 ProjectDetailPage의 renderTabContent에서 교체)
// message를 넘기면 그 문구로 빈 상태 안내 (예: 창작 기여 정리 탭에 자료가 없을 때)

interface Props {
  label?: string;
  message?: string;
}

export default function TabPlaceholder({ label, message }: Props) {
  return (
    <Card>
      <Text>{message ?? `${label} 화면은 준비 중이에요.`}</Text>
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
