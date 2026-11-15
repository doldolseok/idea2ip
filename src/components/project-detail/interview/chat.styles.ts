import styled, { keyframes } from 'styled-components';
import { SubmitButton } from '../../modal/modalForm.styles';
import { colors, media } from '../../../styles/theme';

// AI 인터뷰 진행 중 화면 스타일 (Figma 03-B, 원래 InterviewChat의 값 그대로)

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const ChatSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

/* 채팅 카드와 오른쪽 열은 위쪽 정렬, 채팅 776 : 오른쪽 241 (Figma), 오른쪽은 고정 폭 */
export const ChatRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 19px;

  /* 태블릿 이하: 채팅 위, 참고 자료 아래로 쌓기 */
  ${media.tablet} {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
`;

export const ChatCard = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  height: 459px;
  overflow: hidden;

  ${media.mobile} {
    height: min(560px, calc(100dvh - 140px));
    min-height: 420px;
  }

  background: ${colors.card};
  border: 1px solid ${colors.cardBorder};
  border-radius: 18px;
`;

export const ChatHeader = styled.div`
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

export const ChatHeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  line-height: 1.4;
`;

export const ChatTitle = styled.p`
  margin: 0;
  color: ${colors.textStrong};
  font-size: 18px;
  font-weight: 700;
`;

export const ChatSubtitle = styled.p`
  margin: 0;
  color: ${colors.textSecondary};
  font-size: 14px;
`;

export const ChatBody = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 10px 14px;
`;

/** fill: 채팅 카드 안에서 남은 높이를 채우고 스크롤 / 아니면 최대 480px */
export const MessageList = styled.div<{ $fill: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  ${({ $fill }) => ($fill ? 'flex: 1; min-height: 0;' : 'max-height: 480px;')}
`;

export const AiRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 22px;

  ${media.mobile} {
    gap: 10px;
  }
`;

export const Avatar = styled.img`
  display: block;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
`;

export const AvatarSpace = styled.span`
  flex-shrink: 0;
  width: 36px;
`;

const bubble = `
  max-width: 80%;
  min-width: 0;
  padding: 10px 14px;
  color: ${colors.textStrong};
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

export const AiBubble = styled.p`
  ${bubble}
  margin: 0;
  background: ${colors.rowBg};
  border-radius: 0 14px 14px 14px;
`;

/* AI 메시지 다음 사용자 메시지는 26px 간격 (Figma) */
export const UserRow = styled.div<{ $afterAi: boolean }>`
  display: flex;
  justify-content: flex-end;
  margin-top: ${({ $afterAi }) => ($afterAi ? 12 : 0)}px;
`;

export const UserBubble = styled.p`
  ${bubble}
  margin: 0;
  background: ${colors.userBubbleBg};
  border-radius: 15px 0 15px 15px;
`;

export const Loading = styled.img`
  display: block;
  width: 24px;
  height: 24px;
  margin-bottom: 6px;
  animation: ${spin} 1s linear infinite;
`;

export const InputBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  background: ${colors.card};
  border: 1px solid ${colors.border};
  border-radius: 18px;

  ${media.mobile} {
    gap: 6px;
    padding: 4px 6px 4px 14px;
  }
`;

export const InputLeft = styled.div`
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
export const ClipButton = styled.button`
  ${iconButton}
  width: 20.5px;
  height: 20.5px;

  ${media.mobile} {
    width: 40px;
    height: 40px;
    margin-left: -10px;
  }

  img {
    transform: rotate(-45deg);
  }
`;

export const SendButton = styled.button`
  ${iconButton}
  width: 36px;
  height: 36px;

  ${media.mobile} {
    width: 44px;
    height: 44px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/** 한 줄 입력처럼 보이는 답변 칸 (긴 답변은 최대 4줄까지 늘어남) */
export const AnswerInput = styled.textarea`
  flex: 1;
  min-width: 0;
  max-height: 84px;
  padding: 0;
  color: ${colors.textStrong};
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  background: transparent;
  border: 0;
  outline: none;
  resize: none;
  field-sizing: content;

  ${media.mobile} {
    min-height: 40px;
    padding: 9px 0;
  }

  &::placeholder {
    color: ${colors.textMuted};
  }
`;

/** 입력칸 아래 글자 수 / 오류 (디자인에 없음, 보조 글자 크기로 작게) */
export const InputMeta = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 6px;
  padding: 0 4px;
  color: ${colors.textMuted};
  font-size: 12px;
  line-height: 1.4;

  [role='alert'] {
    color: ${colors.required};
  }
`;

export const SideColumn = styled.div`
  position: relative;
  flex: 0 0 241px;

  ${media.tablet} {
    flex: none;
  }

  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const ReferenceCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 13px;
  min-height: 381px;

  ${media.tablet} {
    min-height: 0;
  }

  padding: 14px 14px 10px;
  background: ${colors.card};
  border: 1px solid ${colors.cardBorder};
  border-radius: 14px;
`;

export const ReferenceTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 11px;
`;

export const ReferenceTitle = styled.p`
  margin: 0;
  color: ${colors.textStrong};
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
`;

export const ReferenceList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid ${colors.cardBorder};
  border-bottom: 1px solid ${colors.cardBorder};
`;

export const ReferenceItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 14px 18px 0;
  line-height: 1.4;

  & + & {
    padding-top: 0;
  }
`;

export const ReferenceIcon = styled.div`
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

export const ReferenceName = styled.p`
  margin: 0;
  color: ${colors.textStrong};
  font-size: 14px;
  overflow-wrap: anywhere;
`;

export const ReferenceType = styled.p`
  margin: 0;
  color: ${colors.textMuted};
  font-size: 12px;
`;

export const Reason = styled.div`
  font-size: 12px;
  line-height: 1.4;
`;

export const ReasonLabel = styled.p`
  margin: 0;
  color: ${colors.textSecondary};
`;

export const ReasonText = styled.p`
  margin: 0;
  color: ${colors.textMuted};
  white-space: pre-wrap;
`;

export const SaveButton = styled(SubmitButton)`
  width: 100%;
  font-weight: 500;

  &:disabled {
    color: ${colors.disabledText};
    background: ${colors.rowBg};
    cursor: not-allowed;
  }
`;

/** 오른쪽 열 아래 보조 버튼 줄 (새로고침 / 질문 생성 재시도, 디자인에 없음) */
export const SideActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${media.tabletOnly} {
    flex-direction: row;
    justify-content: flex-end;
  }
`;
