import styled from 'styled-components';
import FinalWorkForm from './FinalWorkForm';
import FinalWorkView from './FinalWorkView';
import SectionHeader from '../SectionHeader';
import { CardsRow, ToastSpot } from './finalWork.styles';
import { useAlertModal } from '../../../hooks/useAlertModal';
import { useFinalWork } from '../../../store/projectStore';
import type { Project } from '../../../types/project';

// 프로젝트 상세 > "최종 작품" 탭
// - 저장한 최종 작품 없음: 1번 등록 화면 / 있음: 2번 저장 후 화면

interface Props {
  project: Project;
  /** "AI 인터뷰 준비 확인" → AI 인터뷰 탭으로 이동 */
  onGoToInterview: () => void;
}

export default function FinalWorkTab({ project, onGoToInterview }: Props) {
  const finalWork = useFinalWork(project.id);
  const { showAlert, alertNode } = useAlertModal(1800, 'subtle');

  return (
    <Section>
      <SectionHeader title="최종 작품 등록" subtitle="자료별 제작 과정과 역할을 연결할 수 있어요." />

      <CardsRow>
        {finalWork ? (
          <FinalWorkView
            project={project}
            finalWork={finalWork}
            showAlert={showAlert}
            onGoToInterview={onGoToInterview}
          />
        ) : (
          <FinalWorkForm project={project} showAlert={showAlert} />
        )}
        <ToastSpot>{alertNode}</ToastSpot>
      </CardsRow>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;
