import { useState } from 'react';
import styled from 'styled-components';
import ModalShell from '../../modal/ModalShell';
import { CancelButton, ModalActions, ModalChip, SubmitButton } from '../../modal/modalForm.styles';
import EvidenceTag from '../EvidenceTag';
import { BRIEF_SECTION_META } from '../../../mocks/brief';
import { useProjectStore } from '../../../store/projectStore';
import type { BriefReport, BriefSectionKey } from '../../../types/brief';
import { formatDate, formatTime } from '../../../utils/formatDate';
import { colors } from '../../../styles/theme';

interface Props {
  projectId: string;
  report: BriefReport;
  /** 처음 선택된 섹션 (리포트 행을 눌렀으면 그 섹션) */
  initialKey: BriefSectionKey;
  onClose: () => void;
}

// 리포트 탭 4번: Copyright Brief 편집 모달
// 섹션을 바꿔도 수정 중인 내용은 모달을 닫기 전까지 섹션별로 유지, "수정 저장" 시 바뀐 섹션만 저장

export default function BriefEditModal({ projectId, report, initialKey, onClose }: Props) {
  const updateBriefSection = useProjectStore((state) => state.updateBriefSection);
  const [selectedKey, setSelectedKey] = useState(initialKey);
  const [drafts, setDrafts] = useState(() =>
    Object.fromEntries(report.sections.map((s) => [s.key, s.content])),
  );

  const section = report.sections.find((s) => s.key === selectedKey) ?? report.sections[0];
  const meta = BRIEF_SECTION_META[section.key];

  const handleSave = () => {
    report.sections.forEach((s) => {
      if (drafts[s.key] !== s.content) updateBriefSection(projectId, s.key, drafts[s.key]);
    });
    onClose();
  };

  return (
    <ModalShell
      titleId="brief-edit-title"
      title="Copyright Brief 편집"
      subtitle="사용자가 직접 수정한 내용은 저장되며, 이후 AI 갱신 시 자동으로 덮어쓰지 않아요."
      width={820}
      size="lg"
      dim="light"
      shadow
      onClose={onClose}
    >
      <Body>
        <Chips role="tablist" aria-label="Copyright Brief 섹션">
          {report.sections.map((s) => (
            <ModalChip
              key={s.key}
              type="button"
              role="tab"
              aria-selected={s.key === selectedKey}
              $active={s.key === selectedKey}
              style={{ width: 132 }}
              onClick={() => setSelectedKey(s.key)}
            >
              {BRIEF_SECTION_META[s.key].chip}
            </ModalChip>
          ))}
        </Chips>

        <SectionTitle>
          {meta.no} · {section.title}
        </SectionTitle>

        <Editor>
          <EditorInput
            aria-label={`${section.title} 내용`}
            value={drafts[section.key]}
            onChange={(e) => setDrafts((prev) => ({ ...prev, [section.key]: e.target.value }))}
          />
          <Sources>
            <SourcesLabel>출처</SourcesLabel>
            {section.sources.map((kind) => (
              <EvidenceTag key={kind} kind={kind} size="lg" />
            ))}
          </Sources>
        </Editor>

        {section.userEditedAt && (
          <LastEdited>
            마지막 사용자 수정 · {formatDate(section.userEditedAt)}{' '}
            {formatTime(section.userEditedAt)}
          </LastEdited>
        )}

        <Actions>
          <CancelButton type="button" style={{ width: 130 }} onClick={onClose}>
            변경 취소
          </CancelButton>
          <SubmitButton type="button" style={{ width: 150 }} onClick={handleSave}>
            수정 저장
          </SubmitButton>
        </Actions>
      </Body>
    </ModalShell>
  );
}

/* Figma: 820 × 680, 구분선 아래 16px에 칩, 하단 여백 28px */
const Body = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 583px;
  padding: 16px 0 28px;
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 13px;
`;

const SectionTitle = styled.h3`
  margin: 24px 0 12px;
  color: ${colors.text};
  font-size: 15px;
  font-weight: 700;
  line-height: normal;
`;

const Editor = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 310px;
  border: 1px solid ${colors.border};
  border-radius: 10px;
`;

const EditorInput = styled.textarea`
  min-height: 94px;
  flex: 1;
  padding: 17px;
  color: ${colors.text};
  font-family: inherit;
  font-size: 13px;
  line-height: 1.5;
  background: transparent;
  border: 0;
  border-radius: 10px 10px 0 0;
  outline: none;
  resize: none;
`;

const Sources = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 17px;
  padding: 14px 0 17px;
  border-top: 1px solid ${colors.border};
`;

const SourcesLabel = styled.span`
  width: 50px;
  color: ${colors.muted};
  font-size: 12px;
  font-weight: 700;
`;

const LastEdited = styled.p`
  margin: 22px 0 0;
  color: ${colors.muted};
  font-size: 11px;
  line-height: normal;
`;

const Actions = styled(ModalActions)`
  margin-top: auto;
  padding-top: 24px;
  gap: 12px;
`;
