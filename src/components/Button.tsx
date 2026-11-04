import styled from 'styled-components';
import { colors } from '../styles/theme';

const Button = styled.button`
  width: 100%;
  height: 40px;
  margin-top: 32px;
  border: 0;
  border-radius: 10px;
  background: ${colors.primary};
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${colors.primaryHover};
  }

  &:active {
    transform: translateY(1px);
  }
`;

export default Button;
