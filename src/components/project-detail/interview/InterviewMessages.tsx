import { useEffect, useRef, useState } from 'react';
import { getInterviewMessages } from '../../../api/interview';
import type { ServerInterview, ServerInterviewMessage } from '../../../api/interview';
import avatar from '../../../assets/interview-ai-avatar.svg';
import loadingIcon from '../../../assets/interview-loading.svg';
import StatusMessage, { StatusButton } from '../../StatusMessage';
import { AiBubble, AiRow, Avatar, AvatarSpace, Loading, MessageList, UserBubble, UserRow } from './chat.styles';

interface Props {
  projectId: string;
  refreshKey?: number;
  /** 대화 내역에 아직 없으면 마지막에 이어서 보여줄 현재 질문 */
  currentQuestion?: ServerInterview['currentQuestion'];
  /** 다음 질문 생성 대기 중 (AI 입력 중 표시) */
  pending?: boolean;
  /** 채팅 카드 안처럼 높이가 정해진 곳: 영역 안에서 스크롤 */
  fill?: boolean;
}

// AI 인터뷰 대화 내역 (서버 메시지를 Figma 채팅 말풍선으로 표시)

export default function InterviewMessages({ projectId, refreshKey = 0, currentQuestion, pending = false, fill = false }: Props) {
  const [attempt, setAttempt] = useState(0);
  const key = `${projectId}/${refreshKey}/${attempt}`;
  const [result, setResult] = useState<{ key: string; messages?: ServerInterviewMessage[]; error?: string }>();
  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem('accessToken');
    getInterviewMessages(projectId, controller.signal).then((messages) => {
      if (controller.signal.aborted) return;
      if (localStorage.getItem('accessToken') !== token) throw new Error('로그인 상태가 변경되었습니다. 다시 로그인해주세요.');
      setResult({ key, messages });
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setResult({ key, error: error instanceof Error ? error.message : '대화 내역을 불러오지 못했습니다.' });
    });
    return () => controller.abort();
  }, [projectId, key]);
  const current = result?.key === key ? result : undefined;

  const items: { id: number; role: ServerInterviewMessage['role']; content: string }[] =
    current?.messages?.map((message) => ({ id: message.messageId, role: message.role, content: message.content })) ?? [];
  if (current?.messages && currentQuestion && !items.some((item) => item.id === currentQuestion.messageId)) {
    items.push({ id: currentQuestion.messageId, role: 'ASSISTANT', content: currentQuestion.content });
  }

  // 새 메시지가 오면 맨 아래로 스크롤
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [items.length, pending]);

  return (
    <MessageList ref={listRef} aria-label="인터뷰 대화 내역" aria-live="polite" $fill={fill}>
      {!current ? <StatusMessage plain message="대화 내역을 불러오는 중입니다." /> : current.error ? (
        <StatusMessage plain role="alert" message={current.error}
          action={<StatusButton type="button" onClick={() => setAttempt((value) => value + 1)}>다시 시도</StatusButton>} />
      ) : !items.length ? <StatusMessage plain message="아직 대화 내역이 없습니다." /> : items.map((item, i) => {
        if (item.role === 'USER') {
          return (
            <UserRow key={item.id} $afterAi={items[i - 1]?.role === 'ASSISTANT'}>
              <UserBubble>{item.content}</UserBubble>
            </UserRow>
          );
        }
        // 연속된 AI 메시지는 첫 번째에만 아바타 표시
        return (
          <AiRow key={item.id}>
            {items[i - 1]?.role !== 'ASSISTANT' ? <Avatar src={avatar} alt="" /> : <AvatarSpace />}
            <AiBubble>{item.content}</AiBubble>
          </AiRow>
        );
      })}
      {pending && (
        <AiRow>
          {items.at(-1)?.role !== 'ASSISTANT' ? <Avatar src={avatar} alt="" /> : <AvatarSpace />}
          <Loading src={loadingIcon} alt="다음 질문을 준비하고 있어요" />
        </AiRow>
      )}
    </MessageList>
  );
}
