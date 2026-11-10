import styled from 'styled-components';
import SectionHeader from '../SectionHeader';
import { colors } from '../../../styles/theme';

interface Props {
  title: string;
  subtitle: string;
  /** 오른쪽 위 두 줄 (예: 생성 전 확인 / 프로젝트 자동 저장) */
  meta?: [string, string];
}

/** 리포트 탭 상단 제목 + 오른쪽 상태 문구 */
export default function ReportHeader({ title, subtitle, meta }: Props) {
  return (
    <Header>
      <SectionHeader size="lg" title={title} subtitle={subtitle} />
      {meta && (
        <Meta>
          <MetaTitle>{meta[0]}</MetaTitle>
          <MetaSub>{meta[1]}</MetaSub>
        </Meta>
      )}
    </Header>
  );
}

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 64px;
`;

const Meta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
  flex-shrink: 0;
  text-align: right;
`;

const MetaTitle = styled.p`
  margin: 0;
  color: ${colors.textStrong};
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
`;

const MetaSub = styled.p`
  margin: 0;
  color: ${colors.contributionMuted};
  font-size: 10px;
  line-height: 14px;
`;
