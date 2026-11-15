import type { ReactNode } from 'react';
import styled from 'styled-components';
import { colors, media } from '../styles/theme';

interface Props {
  /** status: 불러오는 중 안내 / alert: 오류 안내 */
  role?: 'status' | 'alert';
  message: ReactNode;
  /** 오른쪽 버튼 (다시 시도, 로그인하기 등) */
  action?: ReactNode;
  /** 카드 안에서 쓸 때 배경 없이 표시 */
  plain?: boolean;
  className?: string;
}

/**
 * API 불러오는 중 / 오류 안내 공통 표시
 * Figma에 없는 상태라 기존 안내 박스(연파랑 배경, 보조 글자색) 스타일을 재사용합니다.
 */
export default function StatusMessage({ role = 'status', message, action, plain = false, className }: Props) {
  return (
    <Box role={role} $alert={role === 'alert'} $plain={plain} className={className}>
      <Text>{message}</Text>
      {action}
    </Box>
  );
}

const Box = styled.div<{ $alert: boolean; $plain: boolean }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 16px;
  min-height: 48px;
  padding: ${({ $plain }) => ($plain ? '0' : '12px 16px')};
  color: ${({ $alert }) => ($alert ? colors.required : colors.textSecondary)};
  font-size: 14px;
  line-height: 1.4;
  background: ${({ $plain }) => ($plain ? 'transparent' : colors.chipPositiveBg)};
  border-radius: 10px;
`;

const Text = styled.p`
  flex: 1 1 200px;
  min-width: 0;
  margin: 0;
  overflow-wrap: anywhere;
`;

/** 안내 박스 안 작은 보조 버튼 (다시 시도, 새로고침 등) */
export const StatusButton = styled.button`
  flex-shrink: 0;
  min-height: 37px;
  padding: 0 14px;
  color: ${colors.primary};
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  background: ${colors.card};
  border: 1px solid ${colors.softBlueBorder};
  border-radius: 9px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: ${colors.softBlueBg};
  }

  &:disabled {
    color: ${colors.disabledText};
    cursor: not-allowed;
  }

  ${media.mobile} {
    min-height: 40px;
  }
`;
