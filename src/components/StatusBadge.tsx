import styled, { css } from 'styled-components';
import { PROJECT_STATUS_LABEL } from '../constants/projectStatus';
import type { ProjectStatus } from '../types/project';
import { colors } from '../styles/theme';

interface Props {
  status: ProjectStatus;
  className?: string;
}

/**
 * 프로젝트 상태 뱃지 ("진행 중" / "완료")
 * 크기·너비만 다르면 styled(StatusBadge)`padding: ...;` 로 덮어써서 사용
 */
export default function StatusBadge({ status, className }: Props) {
  return (
    <Badge className={className} $status={status}>
      {PROJECT_STATUS_LABEL[status]}
    </Badge>
  );
}

const Badge = styled.span<{ $status: ProjectStatus }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 6px 26px;
  font-size: 14px;
  line-height: 1.4;
  white-space: nowrap;
  border-radius: 25px;

  ${({ $status }) =>
    $status === 'done'
      ? css`
          color: ${colors.chipInactiveText};
          background: ${colors.chipInactiveBg};
        `
      : css`
          color: ${colors.primary};
          background: ${colors.primarySoft};
        `}
`;
