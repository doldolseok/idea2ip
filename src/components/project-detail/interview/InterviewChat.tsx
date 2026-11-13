import avatarLg from '../../../assets/interview-ai-avatar-lg.svg';
import refImageIcon from '../../../assets/interview-ref-image.svg';
import SectionHeader from '../SectionHeader';
import StatusMessage, { StatusButton } from '../../StatusMessage';
import InterviewMessages from './InterviewMessages';
import InterviewAnswerForm, { INTERVIEW_ANSWER_FORM_ID } from './InterviewAnswerForm';
import { INTERVIEW_FIELD_LABELS } from '../../../api/interview';
import type { ServerInterview } from '../../../api/interview';
import {
  ChatBody,
  ChatCard,
  ChatHeader,
  ChatHeaderText,
  ChatRow,
  ChatSection,
  ChatSubtitle,
  ChatTitle,
  Reason,
  ReasonLabel,
  ReasonText,
  ReferenceCard,
  ReferenceIcon,
  ReferenceItem,
  ReferenceList,
  ReferenceName,
  ReferenceTitle,
  ReferenceTop,
  ReferenceType,
  SaveButton,
  SideActions,
  SideColumn,
} from './chat.styles';

interface Props {
  projectId: string;
  session: ServerInterview;
  /** 대화 내역 다시 불러오기 기준 (상태 새로고침 / 답변 저장 시 증가) */
  refreshKey: number;
  error: string;
  starting: boolean;
  answerBusy: boolean;
  onAnswered: (session: ServerInterview) => void;
  onBusyChange: (busy: boolean) => void;
  onRefresh: () => void;
  onRetryQuestion: () => void;
}

// AI 인터뷰 탭 3번: 인터뷰 진행 중 (Figma 03-B 레이아웃에 서버 질문/대화 연결)

export default function InterviewChat({
  projectId,
  session,
  refreshKey,
  error,
  starting,
  answerBusy,
  onAnswered,
  onBusyChange,
  onRefresh,
  onRetryQuestion,
}: Props) {
  const question = session.currentQuestion;

  return (
    <ChatSection aria-busy={starting}>
      <SectionHeader title="나의 창작을 함께 정리해요." subtitle="AI가 필요한 내용을 질문합니다." />

      {error && <StatusMessage role="alert" message={error} />}

      <ChatRow>
        <ChatCard>
          <ChatHeader>
            <img src={avatarLg} alt="" width={48} height={48} />
            <ChatHeaderText>
              <ChatTitle>Idea2IP AI 인터뷰</ChatTitle>
              <ChatSubtitle>창작 기록을 바탕으로 질문하고 있어요</ChatSubtitle>
            </ChatHeaderText>
          </ChatHeader>

          <ChatBody>
            <InterviewMessages
              projectId={projectId}
              refreshKey={refreshKey}
              currentQuestion={question}
              pending={session.nextQuestionPending || answerBusy}
              fill
            />
            {question ? (
              <InterviewAnswerForm key={question.messageId} projectId={projectId} questionId={question.messageId}
                onBusyChange={onBusyChange} onAnswered={onAnswered} />
            ) : (
              <StatusMessage message={session.nextQuestionPending ? '다음 질문 생성 대기 중입니다.' : '현재 질문이 없습니다.'} />
            )}
          </ChatBody>
        </ChatCard>

        <SideColumn>
          <ReferenceCard>
            <ReferenceTop>
              <ReferenceTitle>이번 질문의 참고 자료</ReferenceTitle>
              {question?.materialRefs.length ? (
                <ReferenceList>
                  {question.materialRefs.map((ref, index) => (
                    <ReferenceItem key={`${ref.sourceId ?? ref.materialId ?? 'ref'}-${index}`}>
                      <ReferenceIcon>
                        <img src={refImageIcon} alt="" width={13} height={11.71} />
                      </ReferenceIcon>
                      <div>
                        <ReferenceName>{ref.title}</ReferenceName>
                        <ReferenceType>{INTERVIEW_FIELD_LABELS[question.targetField]}</ReferenceType>
                      </div>
                    </ReferenceItem>
                  ))}
                </ReferenceList>
              ) : (
                <ReferenceList>
                  <ReferenceItem>
                    <ReferenceType>연결된 참고 자료가 없어요.</ReferenceType>
                  </ReferenceItem>
                </ReferenceList>
              )}
            </ReferenceTop>
            {question && (
              <Reason>
                <ReasonLabel>질문 이유</ReasonLabel>
                <ReasonText>{question.reason ?? `${INTERVIEW_FIELD_LABELS[question.targetField]}에 대한 설명이 필요해요.`}</ReasonText>
              </Reason>
            )}
          </ReferenceCard>

          <SaveButton type="submit" form={INTERVIEW_ANSWER_FORM_ID} disabled={!question || answerBusy || starting}>
            {answerBusy ? '답변 저장 중…' : '답변 저장 및 다음으로'}
          </SaveButton>
          <SideActions>
            <StatusButton type="button" disabled={starting || answerBusy} onClick={onRefresh}>현재 상태 새로고침</StatusButton>
            {session.nextQuestionPending && (
              <StatusButton type="button" disabled={starting || answerBusy} onClick={onRetryQuestion}>
                {starting ? '질문 생성 중…' : '질문 생성 재시도'}
              </StatusButton>
            )}
          </SideActions>
        </SideColumn>
      </ChatRow>
    </ChatSection>
  );
}
