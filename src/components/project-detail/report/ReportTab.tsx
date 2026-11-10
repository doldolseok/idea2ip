import { useCallback, useState } from 'react';
import styled from 'styled-components';
import BriefReady from './BriefReady';
import BriefGenerating from './BriefGenerating';
import BriefReportView from './BriefReportView';
import BriefEditModal from './BriefEditModal';
import BriefPdfPanel from './BriefPdfPanel';
import {
  useBrief,
  useFinalWork,
  useInterview,
  useProjectMaterials,
  useProjectStore,
} from '../../../store/projectStore';
import type { BriefSectionKey } from '../../../types/brief';
import type { Project } from '../../../types/project';
import { countNewInfoSince, describeNewInfo } from '../../../utils/brief';

// 프로젝트 상세 > "리포트" 탭 (Copyright Brief)
// 생성 전(1) → 생성 중(2) → 생성 완료(3) / 새 정보가 있으면 업데이트 배너(6) → 다시 생성 중 → 새 버전
// 리포트는 projectStore에 프로젝트별로 저장 (생성 중 타이머도 store가 관리 → 탭을 나갔다 와도 유지)

export default function ReportTab({ project }: { project: Project }) {
  const brief = useBrief(project.id);
  const materials = useProjectMaterials(project.id);
  const finalWork = useFinalWork(project.id);
  const interview = useInterview(project.id);
  const startBriefGeneration = useProjectStore((state) => state.startBriefGeneration);

  const [editKey, setEditKey] = useState<BriefSectionKey | null>(null);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const closeEdit = useCallback(() => setEditKey(null), []);
  const closePdf = useCallback(() => setIsPdfOpen(false), []);

  const generate = () => startBriefGeneration(project.id);

  if (brief.status === 'generating' && brief.generationStartedAt) {
    return (
      <Section>
        <BriefGenerating startedAt={brief.generationStartedAt} />
      </Section>
    );
  }

  if (brief.status === 'generated' && brief.report) {
    const report = brief.report;
    const newInfoText = describeNewInfo(countNewInfoSince(report, materials, finalWork, interview));

    return (
      <Section>
        <BriefReportView
          report={report}
          newInfoText={newInfoText}
          onUpdate={generate}
          onEdit={setEditKey}
          onOpenPdf={() => setIsPdfOpen(true)}
        />
        {editKey && (
          <BriefEditModal
            projectId={project.id}
            report={report}
            initialKey={editKey}
            onClose={closeEdit}
          />
        )}
        {isPdfOpen && (
          <BriefPdfPanel projectTitle={project.title} report={report} onClose={closePdf} />
        )}
      </Section>
    );
  }

  return (
    <Section>
      <BriefReady onGenerate={generate} />
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
