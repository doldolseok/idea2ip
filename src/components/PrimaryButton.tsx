import styled from 'styled-components';
import { colors } from '../styles/theme';

/**
 * 아이콘 + 텍스트가 들어가는 파란 버튼 (대시보드 "새 프로젝트", 제작 과정 "새 제작자료")
 * $size: 'lg' = 18px 글자 (기본), 'md' = 16px 글자
 */
const PrimaryButton = styled.button<{ $size?: 'md' | 'lg' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-shrink: 0;
  padding: 12px 40px;
  border: none;
  border-radius: 10px;
  background: ${colors.primary};
  color: #ffffff;
  font-size: ${({ $size = 'lg' }) => ($size === 'md' ? 16 : 18)}px;
  font-weight: 600;
  line-height: 1.4;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${colors.primaryHover};
  }

  img {
    display: block;
  }
`;

export default PrimaryButton;
