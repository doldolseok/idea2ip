import styled, { css } from 'styled-components';
import { colors } from '../../styles/theme';

interface Props {
  title: string;
  subtitle: string;
  /** md: 22px 제목 (최종 작품, AI 인터뷰 진행/완료) / lg: 24px 굵은 제목 (창작 기여 정리) */
  size?: 'md' | 'lg';
}

/** 탭 내용 위쪽 섹션 제목 + 부제 */
export default function SectionHeader({ title, subtitle, size = 'md' }: Props) {
  return (
    <Header $size={size}>
      <Title $size={size}>{title}</Title>
      <Subtitle $size={size}>{subtitle}</Subtitle>
    </Header>
  );
}

type SizeProps = { $size: 'md' | 'lg' };

const Header = styled.div<SizeProps>`
  display: flex;
  flex-direction: column;
  gap: ${({ $size }) => ($size === 'lg' ? 5 : 10)}px;
`;

const Title = styled.h2<SizeProps>`
  margin: 0;
  color: ${colors.textStrong};
  font-size: 22px;
  font-weight: 600;
  line-height: normal;

  ${({ $size }) =>
    $size === 'lg' &&
    css`
      font-size: 24px;
      font-weight: 700;
    `}
`;

const Subtitle = styled.p<SizeProps>`
  margin: 0;
  color: ${colors.textSecondary};
  font-size: 14px;
  line-height: 1.4;

  ${({ $size }) =>
    $size === 'lg' &&
    css`
      color: ${colors.contributionMuted};
      font-size: 12px;
      line-height: normal;
    `}
`;
