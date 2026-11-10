import styled from 'styled-components';
import { colors } from '../../styles/theme';

/** 프로젝트 상세 탭 내용을 감싸는 흰색 카드 (안쪽 여백 위아래 40px, 좌우 45px) */
const DetailCard = styled.section`
  padding: 40px 45px;
  background: ${colors.card};
  border: 1px solid ${colors.cardBorder};
  border-radius: 14px;
`;

export default DetailCard;
