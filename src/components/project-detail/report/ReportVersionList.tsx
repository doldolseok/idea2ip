import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { NumberBox, OutlineBlueButton, ReportCard, RowLeft, RowText, RowTitle } from './report.styles';
import StatusMessage from '../../StatusMessage';
import { colors } from '../../../styles/theme';
import { getReportVersions } from '../../../api/reports';
import type { ReportVersionSummary } from '../../../api/reports';
import ReportVersionDetail from './ReportVersionDetail';
import ReportPdfDownload from './ReportPdfDownload';

export default function ReportVersionList({ projectId }: { projectId: string }) {
  const [query, setQuery] = useState<{ attempt: number; before?: number }>({ attempt: 0 });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [result, setResult] = useState<{ attempt: number; versions: ReportVersionSummary[]; next: number | null; error?: string }>();
  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem('accessToken');
    getReportVersions(projectId, { beforeVersionNo: query.before, limit: 20 }, controller.signal).then((page) => {
      if (controller.signal.aborted) return;
      if (localStorage.getItem('accessToken') !== token) throw new Error('로그인 상태가 변경되었습니다.');
      setResult((old) => {
        const items = query.before === undefined ? page.versions : [...(old?.versions ?? []), ...page.versions];
        const unique = [...new Map(items.map((item) => [item.versionId, item])).values()].sort((a, b) => b.versionNo - a.versionNo);
        return { attempt: query.attempt, versions: unique, next: page.nextBeforeVersionNo };
      });
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setResult((old) => ({ attempt: query.attempt, versions: old?.versions ?? [], next: old?.next ?? null, error: error instanceof Error ? error.message : '버전 목록 조회에 실패했습니다.' }));
    });
    return () => controller.abort();
  }, [projectId, query]);
  const loading = result?.attempt !== query.attempt;
  const statuses = { QUEUED: '대기', RUNNING: '생성 중', READY: '준비 완료', FAILED: '실패' };
  const operations = { GENERATE: '최초 생성', UPDATE: '입력 업데이트', EDIT: '직접 편집' };
  const stages = { COLLECTING_INPUT: '입력 수집', LINKING_SOURCES: '출처 연결', DRAFTING: '본문 작성', RENDERING_PDF: 'PDF 생성' } as const;
  return <Card aria-label="리포트 버전 목록" aria-busy={loading}>
    <Top>
      <div>
        <CardTitle>리포트 버전 기록</CardTitle>
        <CardDesc>생성·업데이트·직접 편집한 버전을 확인하고 PDF로 내려받을 수 있어요.</CardDesc>
      </div>
      <SmallButton type="button" disabled={loading} onClick={() => setQuery((old) => ({ attempt: old.attempt + 1 }))}>최신 목록 새로고침</SmallButton>
    </Top>
    {loading && <StatusMessage plain message="버전 목록을 불러오는 중입니다." />}
    {result?.error && <StatusMessage plain role="alert" message={result.error}
      action={<SmallButton type="button" disabled={loading} onClick={() => setQuery((old) => ({ ...old, attempt: old.attempt + 1 }))}>다시 시도</SmallButton>} />}
    {!loading && !result?.error && !result?.versions.length && <Empty>아직 생성된 리포트 버전이 없습니다.</Empty>}
    {!!result?.versions.length && <List>{result.versions.map((version) => <Item key={version.versionId}>
      <RowLeft>
        <NumberBox>v{version.versionNo}</NumberBox>
        <RowText>
          <RowTitle>{operations[version.operation]} · {statuses[version.status]}</RowTitle>
          <Meta>
            생성 {version.createdAt.replace('T', ' ')}
            {version.readyAt && ` · 준비 완료 ${version.readyAt.replace('T', ' ')}`}
            {version.stage && ` · 처리 단계 ${stages[version.stage]}`}
            {` · ${version.pdfAvailable ? 'PDF 준비됨' : 'PDF 준비 전'}`}
          </Meta>
        </RowText>
      </RowLeft>
      <ItemActions>
        <SmallButton type="button" onClick={() => setSelectedId(version.versionId)}>버전 상세 보기</SmallButton>
        <ReportPdfDownload projectId={projectId} versionId={version.versionId} available={version.status === 'READY' && version.pdfAvailable} variant="outline" />
      </ItemActions>
    </Item>)}</List>}
    {result?.next != null && !result.error && <MoreButton type="button" disabled={loading} onClick={() => setQuery((old) => ({ attempt: old.attempt + 1, before: result.next! }))}>이전 버전 더 보기</MoreButton>}
    {selectedId !== null && <ReportVersionDetail key={selectedId} projectId={projectId} versionId={selectedId} onClose={() => setSelectedId(null)} />}
  </Card>;
}

const Card = styled(ReportCard)`
  gap: 10px;
  padding: 16px 18px 14px;
`;

const Top = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const CardTitle = styled.h3`
  margin: 0 0 2px;
  color: ${colors.textStrong};
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
`;

const CardDesc = styled.p`
  margin: 0;
  color: ${colors.contributionMuted};
  font-size: 10px;
  line-height: 14px;
`;

const SmallButton = styled(OutlineBlueButton)`
  height: 40px;
`;

const MoreButton = styled(OutlineBlueButton)`
  align-self: center;
`;

const Empty = styled.p`
  margin: 0;
  padding: 16px 0;
  color: ${colors.contributionMuted};
  font-size: 12px;
  text-align: center;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

/* 리포트 목록 행과 같은 모양, 버튼이 들어가서 높이는 내용에 맞춤 */
const Item = styled.li`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 16px;
  padding: 8px 12px;
  background: ${colors.card};
  border: 1px solid ${colors.contributionBorder};
  border-radius: 10px;
`;

const Meta = styled.span`
  color: ${colors.contributionMuted};
  font-size: 10px;
  line-height: 14px;
  overflow-wrap: anywhere;
`;

const ItemActions = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;
