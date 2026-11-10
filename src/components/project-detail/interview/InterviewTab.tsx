import InterviewReady from './InterviewReady';
import InterviewChat from './InterviewChat';
import InterviewComplete from './InterviewComplete';
import { useInterview, useProjectStore } from '../../../store/projectStore';
import type { ProjectTabKey } from '../../../constants/projectTabs';

interface Props {
  projectId: string;
  onChangeTab: (tab: ProjectTabKey) => void;
}

// 프로젝트 상세 > "AI 인터뷰" 탭
// 시작 전(1·2번) → "AI 인터뷰 시작" → 진행 중(3번) → 마지막 질문 저장 → 완료(4번)
// 진행 상태·대화·답변은 projectStore에 프로젝트별로 저장 → 탭을 나갔다 와도 그대로

export default function InterviewTab({ projectId, onChangeTab }: Props) {
  const session = useInterview(projectId);
  const startInterview = useProjectStore((state) => state.startInterview);

  switch (session.status) {
    case 'in-progress':
      return <InterviewChat projectId={projectId} session={session} />;
    case 'completed':
      return <InterviewComplete onNext={() => onChangeTab('contribution')} />;
    default:
      return (
        <InterviewReady
          projectId={projectId}
          fields={session.fields}
          onStart={() => startInterview(projectId)}
          onGoToProcess={() => onChangeTab('process')}
        />
      );
  }
}
