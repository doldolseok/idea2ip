import { useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import styled, { keyframes } from 'styled-components';
import avatarLg from '../../../assets/interview-ai-avatar-lg.svg';
import avatar from '../../../assets/interview-ai-avatar.svg';
import loadingIcon from '../../../assets/interview-loading.svg';
import clipIcon from '../../../assets/interview-clip.svg';
import sendIcon from '../../../assets/interview-send.svg';
import refImageIcon from '../../../assets/interview-ref-image.svg';
import SectionHeader from '../SectionHeader';
import { SubmitButton } from '../../modal/modalForm.styles';
import { useAlertModal } from '../../../hooks/useAlertModal';
import { useProjectStore } from '../../../store/projectStore';
import { ACK_MESSAGE } from '../../../mocks/interview';
import type { InterviewSession } from '../../../types/interview';
import { createMessage, getCurrentQuestion } from '../../../utils/interview';
import { colors } from '../../../styles/theme';

/** 목업 AI 응답 대기 시간 */
const AI_REPLY_DELAY_MS = 900;

interface Props {
  projectId: string;
  session: InterviewSession;
}

// AI 인터뷰 탭 3번: 인터뷰 진행 중 (목업 AI 채팅)

export default function InterviewChat({ projectId, session }: Props) {
  const sendInterviewAnswer = useProjectStore((state) => state.sendInterviewAnswer);
  const addInterviewMessage = useProjectStore((state) => state.addInterviewMessage);
  const saveInterviewAnswer = useProjectStore((state) => state.saveInterviewAnswer);
  const { showAlert, alertNode } = useAlertModal(1800, 'subtle');

  const [input, setInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const question = getCurrentQuestion(session);

  // 새 메시지가 오면 맨 아래로 스크롤
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [session.messages.length, isAiTyping]);

  const send = () => {
    const text = input.trim();
    if (!text) return;

    sendInterviewAnswer(projectId, text);
    setInput('');

    // TODO: AI 서버 연동 시 실제 응답으로 교체 (탭을 나가도 응답은 store에 저장됨)
    setIsAiTyping(true);
    window.setTimeout(() => {
      addInterviewMessage(projectId, createMessage('ai', ACK_MESSAGE));
      setIsAiTyping(false);
    }, AI_REPLY_DELAY_MS);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    send();
  };

  // 한글 조합 중 Enter는 무시 (마지막 글자가 두 번 전송되는 문제 방지)
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  };

  const handleSaveAndNext = () => {
    // 마지막 질문이면 store가 완료 처리 → 탭이 완료 화면으로 바뀜
    if (saveInterviewAnswer(projectId) === 'no-answer') showAlert('답변을 입력해 주세요.');
  };

  const lastRole = session.messages.at(-1)?.role;

  return (
    <Section>
      <SectionHeader title="나의 창작을 함께 정리해요." subtitle="AI가 필요한 내용을 질문합니다." />

      <Row>
        <ChatCard>
          <ChatHeader>
            <img src={avatarLg} alt="" width={48} height={48} />
            <ChatHeaderText>
              <ChatTitle>Idea2IP AI 인터뷰</ChatTitle>
              <ChatSubtitle>창작 기록을 바탕으로 질문하고 있어요</ChatSubtitle>
            </ChatHeaderText>
          </ChatHeader>

          <ChatBody>
            <Messages ref={scrollRef} aria-live="polite">
              {session.messages.map((message, i) => {
                if (message.role === 'user') {
                  return (
                    <UserRow key={message.id} $afterAi={session.messages[i - 1]?.role === 'ai'}>
                      <UserBubble>{message.text}</UserBubble>
                    </UserRow>
                  );
                }
                // 연속된 AI 메시지는 첫 번째에만 아바타 표시
                const showAvatar = session.messages[i - 1]?.role !== 'ai';
                return (
                  <AiRow key={message.id}>
                    {showAvatar ? <Avatar src={avatar} alt="" /> : <AvatarSpace />}
                    <AiBubble>{message.text}</AiBubble>
                  </AiRow>
                );
              })}
              {isAiTyping && (
                <AiRow>
                  {lastRole !== 'ai' ? <Avatar src={avatar} alt="" /> : <AvatarSpace />}
                  <Loading src={loadingIcon} alt="AI가 답변을 준비하고 있어요" />
                </AiRow>
              )}
            </Messages>

            <InputBar onSubmit={handleSubmit}>
              <InputLeft>
                {/* TODO: 파일 첨부 동작 연결 */}
                <ClipButton type="button" aria-label="파일 첨부">
                  <img src={clipIcon} alt="" width={15.5} height={16.51} />
                </ClipButton>
                <Input
                  aria-label="답변 입력"
                  placeholder="답변을 입력해 주세요."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </InputLeft>
              <SendButton type="submit" aria-label="답변 전송">
                <img src={sendIcon} alt="" width={36} height={36} />
              </SendButton>
            </InputBar>
          </ChatBody>
        </ChatCard>

        <SideColumn>
          <ReferenceCard>
            <ReferenceTop>
              <ReferenceTitle>이번 질문의 참고 자료</ReferenceTitle>
              <ReferenceItem>
                <ReferenceIcon>
                  <img src={refImageIcon} alt="" width={13} height={11.71} />
                </ReferenceIcon>
                <div>
                  <ReferenceName>{question?.reference.name}</ReferenceName>
                  <ReferenceType>{question?.reference.type}</ReferenceType>
                </div>
              </ReferenceItem>
            </ReferenceTop>
            <Reason>
              <ReasonLabel>질문 이유</ReasonLabel>
              <ReasonText>{question?.reason}</ReasonText>
            </Reason>
          </ReferenceCard>

          <SaveButton type="button" onClick={handleSaveAndNext}>
            답변 저장 및 다음으로
          </SaveButton>
          <ToastSpot>{alertNode}</ToastSpot>
        </SideColumn>
      </Row>
    </Section>
  );
}

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

/* 채팅 카드와 오른쪽 열은 위쪽 정렬, 채팅 776 : 오른쪽 241 (Figma), 오른쪽은 고정 폭 */
const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 19px;
`;

const ChatCard = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  height: 459px;
  overflow: hidden;
  background: ${colors.card};
  border: 1px solid ${colors.cardBorder};
  border-radius: 18px;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 14px 20px;
  border-bottom: 1px solid ${colors.cardBorder};

  img {
    display: block;
    flex-shrink: 0;
  }
`;

const ChatHeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1.4;
`;

const ChatTitle = styled.p`
  margin: 0;
  color: ${colors.textStrong};
  font-size: 18px;
  font-weight: 700;
`;

const ChatSubtitle = styled.p`
  margin: 0;
  color: ${colors.textSecondary};
  font-size: 14px;
`;

const ChatBody = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 10px 14px;
`;

const Messages = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
`;

const AiRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 22px;
`;

const Avatar = styled.img`
  display: block;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
`;

const AvatarSpace = styled.span`
  flex-shrink: 0;
  width: 36px;
`;

const bubble = `
  max-width: 80%;
  padding: 10px 14px;
  color: ${colors.textStrong};
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: keep-all;
`;

const AiBubble = styled.p`
  ${bubble}
  margin: 0;
  background: ${colors.rowBg};
  border-radius: 0 14px 14px 14px;
`;

/* AI 메시지 다음 사용자 메시지는 26px 간격 (Figma) */
const UserRow = styled.div<{ $afterAi: boolean }>`
  display: flex;
  justify-content: flex-end;
  margin-top: ${({ $afterAi }) => ($afterAi ? 12 : 0)}px;
`;

const UserBubble = styled.p`
  ${bubble}
  margin: 0;
  background: ${colors.userBubbleBg};
  border-radius: 15px 0 15px 15px;
`;

const Loading = styled.img`
  display: block;
  width: 24px;
  height: 24px;
  margin-bottom: 6px;
  animation: ${spin} 1s linear infinite;
`;

const InputBar = styled.form`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  background: ${colors.card};
  border: 1px solid ${colors.border};
  border-radius: 18px;
`;

const InputLeft = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const iconButton = `
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
  background: transparent;
  border: 0;
  cursor: pointer;

  img {
    display: block;
  }
`;

/* Figma: 클립 아이콘을 -45도 회전해서 20.5px 영역에 배치 */
const ClipButton = styled.button`
  ${iconButton}
  width: 20.5px;
  height: 20.5px;

  img {
    transform: rotate(-45deg);
  }
`;

const SendButton = styled.button`
  ${iconButton}
  width: 36px;
  height: 36px;
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0;
  color: ${colors.textStrong};
  font-size: 14px;
  line-height: normal;
  background: transparent;
  border: 0;
  outline: none;

  &::placeholder {
    color: ${colors.textMuted};
  }
`;

const SideColumn = styled.div`
  position: relative;
  flex: 0 0 241px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const ReferenceCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 13px;
  min-height: 381px;
  padding: 14px 14px 10px;
  background: ${colors.card};
  border: 1px solid ${colors.cardBorder};
  border-radius: 14px;
`;

const ReferenceTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 11px;
`;

const ReferenceTitle = styled.p`
  margin: 0;
  color: ${colors.textStrong};
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
`;

const ReferenceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 14px 18px 0;
  line-height: 1.4;
  border-top: 1px solid ${colors.cardBorder};
  border-bottom: 1px solid ${colors.cardBorder};
`;

const ReferenceIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 31px;
  height: 31px;
  background: ${colors.primarySoft};
  border-radius: 999px;

  img {
    display: block;
  }
`;

const ReferenceName = styled.p`
  margin: 0;
  color: ${colors.textStrong};
  font-size: 14px;
`;

const ReferenceType = styled.p`
  margin: 0;
  color: ${colors.textMuted};
  font-size: 12px;
`;

const Reason = styled.div`
  font-size: 12px;
  line-height: 1.4;
`;

const ReasonLabel = styled.p`
  margin: 0;
  color: ${colors.textSecondary};
`;

const ReasonText = styled.p`
  margin: 0;
  color: ${colors.textMuted};
`;

const SaveButton = styled(SubmitButton)`
  width: 100%;
  font-weight: 500;
`;

/* 경고 토스트: 버튼(46px)을 가리지 않게 버튼 바로 위 가운데 */
const ToastSpot = styled.div`
  position: absolute;
  bottom: 96px;
  left: 50%;
  width: 0;
  height: 0;
`;
