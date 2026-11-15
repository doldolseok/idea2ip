import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { InterviewAnswerError, submitInterviewAnswer } from '../../../api/interview';
import type { InterviewAnswerInput, ServerInterview } from '../../../api/interview';
import clipIcon from '../../../assets/interview-clip.svg';
import sendIcon from '../../../assets/interview-send.svg';
import { AnswerInput, ClipButton, InputBar, InputLeft, InputMeta, SendButton } from './chat.styles';

/** 오른쪽 "답변 저장 및 다음으로" 버튼이 이 폼을 제출할 때 쓰는 id */
export const INTERVIEW_ANSWER_FORM_ID = 'interview-answer-form';

export default function InterviewAnswerForm({ projectId, questionId, onAnswered, onBusyChange }: {
  projectId: string; questionId: number; onAnswered: (session: ServerInterview) => void; onBusyChange: (busy: boolean) => void;
}) {
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [retrying, setRetrying] = useState(false);
  const lock = useRef(false);
  const pending = useRef<InterviewAnswerInput | undefined>(undefined);
  const submit = async () => {
    if (lock.current) return;
    if (!content.trim() || content.length > 8000) { setError('답변을 1~8,000자로 입력해주세요.'); return; }
    const input = pending.current ?? { questionId, content, requestId: crypto.randomUUID() };
    pending.current = input;
    lock.current = true;
    setBusy(true);
    onBusyChange(true);
    setError('');
    const token = localStorage.getItem('accessToken');
    try {
      const result = await submitInterviewAnswer(projectId, input);
      if (localStorage.getItem('accessToken') !== token) throw new InterviewAnswerError(401, '로그인 상태가 변경되었습니다. 다시 로그인해주세요.');
      pending.current = undefined;
      setRetrying(false);
      setContent('');
      onAnswered(result.interview);
    } catch (cause) {
      const keepRequest = cause instanceof InterviewAnswerError && [0, 500, 503].includes(cause.status);
      if (!keepRequest) pending.current = undefined;
      setRetrying(keepRequest);
      setError(cause instanceof Error ? cause.message : '답변을 제출하지 못했습니다.');
    } finally {
      lock.current = false;
      setBusy(false);
      onBusyChange(false);
    }
  };

  // 한글 조합 중 Enter는 무시, Shift+Enter는 줄바꿈
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void submit();
    }
  };

  const sendLabel = busy ? '답변 저장 중…' : retrying ? '같은 답변으로 재시도' : '답변 제출';
  return <form id={INTERVIEW_ANSWER_FORM_ID} onSubmit={(event) => { event.preventDefault(); void submit(); }} aria-busy={busy}>
    <InputBar>
      <InputLeft>
        {/* 파일 첨부는 아직 연결되지 않음 (Figma 아이콘 유지) */}
        <ClipButton type="button" aria-label="파일 첨부" disabled>
          <img src={clipIcon} alt="" width={15.5} height={16.51} />
        </ClipButton>
        <AnswerInput id="interview-answer" aria-label="내 답변" placeholder="답변을 입력해 주세요." rows={1}
          value={content} maxLength={8000} readOnly={busy || retrying}
          onChange={(event) => setContent(event.target.value)} onKeyDown={handleKeyDown} />
      </InputLeft>
      <SendButton type="submit" aria-label={sendLabel} title={sendLabel} disabled={busy || !content.trim()}>
        <img src={sendIcon} alt="" width={36} height={36} />
      </SendButton>
    </InputBar>
    <InputMeta>
      {error ? <span role="alert">{error}</span> : <span>{busy ? '답변을 저장하고 있어요.' : 'Enter로 전송, Shift+Enter로 줄바꿈'}</span>}
      <span>{content.length.toLocaleString()} / 8,000자</span>
    </InputMeta>
  </form>;
}
