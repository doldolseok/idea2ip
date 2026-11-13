import { useRef, useState } from 'react';
import { useReportVersion } from './useReportVersion';
import { ReportRequestError, requestReportVersion } from '../api/reports';
import type { EditableReportSection, ReportOverview, ReportVersion, ReportVersionRequest } from '../api/reports';

/**
 * 리포트 버전 생성·업데이트·편집 요청 (기존 ReportVersionPanel의 요청 로직을 화면과 분리해 그대로 옮김)
 * - 같은 요청이 끝나지 않았거나 연결 오류면 requestId를 유지(frozen)해서 같은 요청으로 다시 확인
 * - 실패한 작업이 재시도 가능하면 retry: true 로 같은 요청을 다시 보냄
 */
export function useReportVersionRequest({ projectId, canGenerate, overview, overviewReady, onRequested }: {
  projectId: string; canGenerate: boolean; overview?: ReportOverview; overviewReady: boolean; onRequested: () => void;
}) {
  const [localVersion, setVersion] = useState<ReportVersion>();
  const [localReady, setReady] = useState<ReportVersion>();
  const [busy, setBusy] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [error, setError] = useState('');
  const lock = useRef(false);
  const request = useRef<ReportVersionRequest | undefined>(undefined);
  const base = overview?.latestReadyVersion ?? localReady;
  const latestDetail = useReportVersion(projectId, base?.versionId);
  const jobDetail = useReportVersion(projectId, localVersion?.versionId ?? overview?.activeVersion?.versionId);
  const ready = latestDetail.data?.status === 'READY' ? latestDetail.data : localReady?.versionId === base?.versionId ? localReady : undefined;
  const version = jobDetail.data ?? localVersion;
  const active = !!overview?.activeVersion || overview?.reportStatus === 'GENERATING';

  /** 새 요청 가능 여부 (기존 버튼 disabled 조건과 같음) */
  const canRequest = (operation: ReportVersionRequest['operation']) => !busy && overviewReady && !active &&
    (operation === 'EDIT' || canGenerate) &&
    !(operation === 'GENERATE' && !!base) &&
    !(operation === 'UPDATE' && (!base || !overview?.canUpdate)) &&
    !(operation === 'EDIT' && (!ready || ready.versionId !== base?.versionId)) &&
    !(version?.status === 'FAILED' && !version.failure?.retryable);

  const run = async (operation: ReportVersionRequest['operation'], editedSections?: { sectionKey: EditableReportSection; paragraphs: string[] }[]) => {
    if (lock.current) return;
    let input = request.current;
    if (!input) {
      if (!overviewReady || active) return;
      if (operation !== 'EDIT' && !canGenerate) return;
      if (operation === 'UPDATE' && !overview?.canUpdate) return;
      if (operation !== 'GENERATE' && !base) { setError('최신 READY 버전이 필요합니다.'); return; }
      input = { requestId: crypto.randomUUID(), operation, ...(operation !== 'GENERATE' ? { baseVersionId: base!.versionId } : {}) };
      if (operation === 'EDIT') input.editedSections = editedSections;
    }
    if (version?.status === 'FAILED' && version.failure?.retryable) input = { ...input, retry: true };
    request.current = input;
    lock.current = true; setBusy(true); setFrozen(true); setError('');
    const token = localStorage.getItem('accessToken');
    try {
      const result = await requestReportVersion(projectId, input);
      if (localStorage.getItem('accessToken') !== token) throw new Error('로그인 상태가 변경되었습니다.');
      setVersion(result);
      onRequested();
      if (result.status === 'READY') {
        setReady(result); request.current = undefined; setFrozen(false);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '리포트 요청에 실패했습니다.');
      if (cause instanceof ReportRequestError && [400,401,403,404,409].includes(cause.status)) { request.current = undefined; setFrozen(false); }
      if (cause instanceof ReportRequestError && cause.status === 409) onRequested();
    } finally { lock.current = false; setBusy(false); }
  };

  /** 멈춘(frozen) 요청 이어가기: 진행 중이면 상태 조회, 완료면 정리, 그 외에는 같은 요청 재전송 */
  const continueRequest = () => {
    if (version && ['QUEUED','RUNNING'].includes(version.status)) jobDetail.refresh();
    else if (frozen && version?.status === 'READY') { request.current = undefined; setFrozen(false); }
    else if (request.current) void run(request.current.operation);
  };

  /** 최신 READY 버전 기준으로 새 작업 준비 (멈춘 요청 버리기) */
  const reset = () => { request.current = undefined; setFrozen(false); setVersion(undefined); setError(''); };

  return { busy, frozen, error, base, ready, version, active, latestDetail, jobDetail, canRequest, run, continueRequest, reset };
}
