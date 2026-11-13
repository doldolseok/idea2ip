import styled from 'styled-components';
import { colors, media } from '../../styles/theme';

/** 프로젝트 상세 탭 내용을 감싸는 흰색 카드 (안쪽 여백 위아래 40px, 좌우 45px) */
const DetailCard = styled.section`
  padding: 40px 45px;
  background: ${colors.card};
  border: 1px solid ${colors.cardBorder};
  border-radius: 14px;

  ${media.tablet} {
    padding: 32px 28px;
  }

  ${media.mobile} {
    padding: 20px 16px;
  }
`;

export default DetailCard;
