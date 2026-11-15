import { useEffect, useRef, useState } from 'react';
import InterviewReady from './InterviewReady';
import InterviewComplete from './InterviewComplete';
import styled from 'styled-components';
import InterviewMessages from './InterviewMessages';
import InterviewChat from './InterviewChat';
import StatusMessage, { StatusButton } from '../../StatusMessage';
import { colors } from '../../../styles/theme';
import { getInterviewStatus, startInterview } from '../../../api/interview';
import type { ServerInterview } from '../../../api/interview';
import type { ProjectTabKey } from '../../../constants/projectTabs';
import { PanelTitle } from './interview.styles';

export default function InterviewTab({ projectId, onChangeTab }: { projectId: string; onChangeTab: (tab: ProjectTabKey) => void }) {
  const [session, setSession] = useState<ServerInterview>();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');
  const [questionError, setQuestionError] = useState('');
  const [pollRound, setPollRound] = useState(0);
  const lock = useRef(false);
  const [answerBusy, setAnswerBusy] = useState(false);
  const [messageRevision, setMessageRevision] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState<{ projectId: string; attempt: number }>();
  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem('accessToken');
    getInterviewStatus(projectId, controller.signal).then((result) => {
      if (controller.signal.aborted) return;
      if (localStorage.getItem('accessToken') !== token) throw new Error('로그인 상태가 변경되었습니다. 다시 로그인해주세요.');
      setSession(result);
      setError('');
      setLoaded({ projectId, attempt });
    }).catch((cause: unknown) => {
      if (controller.signal.aborted) return;
      setError(cause instanceof Error ? cause.message : '인터뷰 상태를 불러오지 못했습니다.');
      setLoaded({ projectId, attempt });
    });
    return () => controller.abort();
  }, [projectId, attempt]);
  // 조회는 질문을 생성하지 않습니다. 대기 중에는 최대 10회만 상태를 확인합니다.
  const pending = session?.status === 'IN_PROGRESS' && session.nextQuestionPending;
  useEffect(() => {
    if (!pending || questionError || starting) return;
    const controller = new AbortController();
    const token = localStorage.getItem('accessToken');
    const timer: { current?: ReturnType<typeof setTimeout> } = {};
    const check = async (count = 0) => {
      try {
        const next = await getInterviewStatus(projectId, controller.signal);
        if (controller.signal.aborted) return;
        if (localStorage.getItem('accessToken') !== token) throw new Error('로그인 상태가 변경되었습니다. 다시 로그인해주세요.');
        setSession(next);
        setMessageRevision((value) => value + 1);
        const nextCount = count + 1;
        if (next.status === 'IN_PROGRESS' && next.nextQuestionPending) {
          if (nextCount >= 10) setQuestionError('다음 질문이 아직 준비되지 않았습니다. 자동 확인을 중단했습니다. 잠시 후 상태를 확인하거나 질문 생성을 재시도해주세요.');
          else timer.current = setTimeout(() => { void check(nextCount); }, 3000);
        }
      } catch (cause) {
        if (!controller.signal.aborted) setQuestionError(cause instanceof Error ? cause.message : '질문 생성 상태를 확인하지 못했습니다.');
      }
    };
    timer.current = setTimeout(check, 3000);
    return () => { controller.abort(); clearTimeout(timer.current); };
  }, [projectId, pending, pollRound, questionError, starting]);
  const handleStart = async () => {
    if (lock.current || answerBusy) return;
    lock.current = true;
    setStarting(true);
    setError('');
    setQuestionError('');
    const token = localStorage.getItem('accessToken');
    try {
      const result = await startInterview(projectId);
      if (localStorage.getItem('accessToken') !== token) throw new Error('로그인 상태가 변경되었습니다. 다시 로그인해주세요.');
      setSession(result);
      setPollRound((value) => value + 1);
    } catch (cause) {
      setQuestionError(cause instanceof Error ? cause.message : '인터뷰를 시작하지 못했습니다.');
    } finally {
      lock.current = false;
      setStarting(false);
    }
  };
  if (loaded?.projectId !== projectId || loaded.attempt !== attempt) return <StatusMessage message="인터뷰 상태를 불러오는 중입니다." />;
  if (!session) return (
    <StatusMessage role="alert" message={error}
      action={<StatusButton type="button" onClick={() => setAttempt((value) => value + 1)}>다시 시도</StatusButton>} />
  );
  if (session.status === 'COMPLETED') return (
    <Completed>
      <InterviewComplete onNext={() => onChangeTab('contribution')} />
      {/* 완료 후 대화 내역 (디자인에 없음, 진행 중 화면의 말풍선 카드 재사용) */}
      <HistoryCard aria-label="인터뷰 대화 내역">
        <PanelTitle>대화 내역</PanelTitle>
        <InterviewMessages projectId={projectId} refreshKey={attempt + messageRevision} />
      </HistoryCard>
    </Completed>
  );
  if (session?.status === 'IN_PROGRESS') return (
    <InterviewChat
      projectId={projectId}
      session={session}
      refreshKey={attempt + messageRevision}
      error={questionError || error}
      starting={starting}
      answerBusy={answerBusy}
      onBusyChange={setAnswerBusy}
      onAnswered={(next) => { setSession(next); setMessageRevision((value) => value + 1); }}
      onRefresh={() => { setQuestionError(''); setPollRound((value) => value + 1); setAttempt((value) => value + 1); }}
      onRetryQuestion={handleStart}
    />
  );
  return <Ready>
    {(questionError || error) && <StatusMessage role="alert" message={questionError || error} />}
    <InterviewReady projectId={projectId} onStart={handleStart} starting={starting} onGoToProcess={() => onChangeTab('process')} />
  </Ready>;
}

const Completed = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const HistoryCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  background: ${colors.card};
  border: 1px solid ${colors.cardBorder};
  border-radius: 18px;
`;

const Ready = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
