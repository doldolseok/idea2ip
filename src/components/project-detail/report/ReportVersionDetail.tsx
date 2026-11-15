import styled from 'styled-components';
import ModalShell from '../../modal/ModalShell';
import { useReportVersion } from '../../../hooks/useReportVersion';
import ReportPdfDownload from './ReportPdfDownload';
import { OutlineBlueButton } from './report.styles';
import StatusMessage from '../../StatusMessage';
import { colors } from '../../../styles/theme';

// 리포트 버전 상세 (디자인에 없는 화면, 공통 모달 틀 + 리포트 글자 스타일 재사용)

export default function ReportVersionDetail({ projectId, versionId, onClose }: { projectId: string; versionId: number; onClose: () => void }) {
  const { data, error, loading, refresh } = useReportVersion(projectId, versionId);
  const metadata = { edition: '판본', publisher: '발행처', publishedOn: '발행일', effectiveFrom: '시행 시작일', effectiveTo: '시행 종료일', retrievedOn: '조회일' };
  return <ModalShell titleId="report-version-detail-title" title="리포트 버전 상세" width={760} dim="light" shadow onClose={onClose}>
    <Body>
      <Toolbar>
        <OutlineBlueButton type="button" onClick={refresh}>버전 새로고침</OutlineBlueButton>
        {data && <ReportPdfDownload projectId={projectId} versionId={data.versionId} available={data.status === 'READY' && data.pdfAvailable} />}
      </Toolbar>
      {loading && <StatusMessage message="버전을 불러오는 중입니다." />}
      {error && <StatusMessage role="alert" message={error} />}
      {data && <Article>
        <h3>버전 {data.versionNo} · {({ QUEUED: '대기', RUNNING: '생성 중', READY: '준비 완료', FAILED: '실패' })[data.status]}</h3>
        {data.stage && <Muted>처리 단계: {data.stage}</Muted>}
        <Muted>생성: {data.createdAt} · 갱신: {data.updatedAt}</Muted>
        {data.failure && <StatusMessage role="alert" message={`${data.failure.code} · ${data.failure.message}`} />}
        {data.sections.map((section) => <Section key={section.sectionKey}>
          <h4>{section.title}{section.userEdited ? ' (사용자 편집)' : ''}</h4>
          {section.paragraphs.map((p, index) => <p key={index}>{p}</p>)}
          {!!section.sourceIds.length && <Muted>연결 출처: {section.sourceIds.join(', ')}</Muted>}
        </Section>)}
        {!!data.reviewFlags.length && <Section><h4>편집 검토 안내</h4>{data.reviewFlags.map((flag, i) => <div key={i}>
          <Muted>{flag.sectionKey} · {flag.code}</Muted><Muted>출처: {flag.sourceIds.join(', ')}</Muted>
          {flag.retainedUserParagraphs.map((p, j) => <p key={j}>{p}</p>)}
        </div>)}</Section>}
        <Section>
          <h4>출처</h4>{!data.sources.length && <Muted>출처 없음</Muted>}
          {data.sources.map((source, i) => <Source key={`${source.sourceId}/${i}`}>
            <strong>{source.title}</strong><Muted>{source.kind}</Muted>
            {source.quote && <blockquote>{source.quote}</blockquote>}{source.locator && <Muted>{source.locator}</Muted>}
            {typeof source.officialUrl === 'string' && /^https?:\/\//i.test(source.officialUrl) && <a href={source.officialUrl} target="_blank" rel="noreferrer">공식 자료 보기</a>}
            <dl>{Object.entries(metadata).map(([key, label]) => typeof source[key] === 'string' && <div key={key}><dt>{label}</dt><dd>{String(source[key])}</dd></div>)}</dl>
          </Source>)}
        </Section>
        <Muted>입력 리비전 {data.inputRevision} · 스키마 {data.schemaVersion ?? '미제공'} · 템플릿 {data.templateVersion ?? '미제공'} · 모드 {data.mode ?? '미제공'}</Muted>
      </Article>}
    </Body>
  </ModalShell>;
}

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0 28px;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
`;

const Article = styled.article`
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: ${colors.text};
  font-size: 13px;
  line-height: 1.6;
  overflow-wrap: anywhere;

  h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
  }

  h4 {
    margin: 0 0 4px;
    color: ${colors.textStrong};
    font-size: 14px;
    font-weight: 600;
  }

  p {
    margin: 0;
    white-space: pre-wrap;
  }

  a {
    color: ${colors.primary};
  }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px;
  border: 1px solid ${colors.contributionBorder};
  border-radius: 10px;
`;

const Source = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  blockquote {
    margin: 4px 0;
    padding-left: 10px;
    color: ${colors.contributionMuted};
    border-left: 2px solid ${colors.softBlueBorder};
  }

  dl {
    margin: 0;
  }

  dl div {
    display: flex;
    gap: 6px;
    color: ${colors.contributionMuted};
    font-size: 12px;
  }

  dd {
    margin: 0;
  }
`;

const Muted = styled.p`
  color: ${colors.contributionMuted};
  font-size: 12px;
`;
