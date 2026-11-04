import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '../styles/theme';

export const Form = styled.form`
  width: 100%;
`;

/** 입력 필드 묶음 (필드 사이 간격 12px) */
export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

/** 마지막 입력창 바로 아래 기준점. 모달이 여기서 뜸 */
export const AlertSlot = styled.div`
  position: relative;
  height: 0;
`;

export const FooterLink = styled(Link)`
  display: block;
  margin-top: 14px;
  text-align: center;
  font-size: 13px;
  color: ${colors.muted};
  text-decoration: underline;
`;
