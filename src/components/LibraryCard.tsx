import styled from 'styled-components';
import { colors } from '../styles/theme';

interface Props {
  icon: string;
  label: string;
  count: number;
}

// 대시보드 "자료실" 카드 (자료 종류별 개수)

export default function LibraryCard({ icon, label, count }: Props) {
  return (
    <Card>
      <IconCircle>
        <img src={icon} alt="" width={20} height={20} />
      </IconCircle>
      <Text>
        <Label>{label}</Label>
        <Count>{String(count).padStart(2, '0')}</Count>
      </Text>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;
  flex-shrink: 0;
  padding: 22px 36px 22px 24px;
  background: ${colors.card};
  border: 1px solid ${colors.cardBorder};
  border-radius: 15px;
`;

const IconCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 41px;
  height: 41px;
  flex-shrink: 0;
  background: ${colors.primarySoft};
  border-radius: 50%;

  img {
    display: block;
  }
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 73px;
  font-weight: 600;
  line-height: 1.4;
`;

const Label = styled.p`
  margin: 0;
  color: ${colors.textSecondary};
  font-size: 16px;
  white-space: nowrap;
`;

const Count = styled.p`
  margin: 0;
  color: ${colors.text};
  font-size: 28px;
`;
