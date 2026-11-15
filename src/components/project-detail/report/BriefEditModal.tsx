import { useState } from 'react';
import styled from 'styled-components';
import ModalShell from '../../modal/ModalShell';
import { CancelButton, ModalActions, ModalChip, SubmitButton } from '../../modal/modalForm.styles';
import EvidenceTag from '../EvidenceTag';
import { BRIEF_SECTION_META } from '../../../mocks/brief';
import type { BriefReport, BriefSectionKey } from '../../../types/brief';
import { formatDate, formatTime } from '../../../utils/formatDate';
import { colors, media } from '../../../styles/theme';

interface Props {
  report: BriefReport;
  /** 처음 선택된 섹션 (리포트 행을 눌렀으면 그 섹션) */
  initialKey: BriefSectionKey;
  /** 서버에서 직접 편집할 수 있는 섹션 (나머지는 읽기 전용) */
  editableKeys: BriefSectionKey[];
  saving: boolean;
  error?: string;
  /** 바뀐 섹션만 전달 (서버 EDIT 요청) */
  onSave: (changes: Partial<Record<BriefSectionKey, string>>) => void;
  onClose: () => void;
}

// 리포트 탭 4번: Copyright Brief 편집 모달
// 섹션을 바꿔도 수정 중인 내용은 모달을 닫기 전까지 섹션별로 유지, "수정 저장" 시 바뀐 섹션만 저장

export default function BriefEditModal({ report, initialKey, editableKeys, saving, error, onSave, onClose }: Props) {
  const [selectedKey, setSelectedKey] = useState(initialKey);
  const [drafts, setDrafts] = useState(() =>
    Object.fromEntries(report.sections.map((s) => [s.key, s.content])),
  );

  const section = report.sections.find((s) => s.key === selectedKey) ?? report.sections[0];
  const meta = BRIEF_SECTION_META[section.key];

  const editable = editableKeys.includes(section.key);

  const handleSave = () => {
    const changes = Object.fromEntries(
      report.sections
        .filter((s) => editableKeys.includes(s.key) && drafts[s.key] !== s.content)
        .map((s) => [s.key, drafts[s.key]]),
    ) as Partial<Record<BriefSectionKey, string>>;
    if (!Object.keys(changes).length) { onClose(); return; }
    onSave(changes);
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
      onClose={() => { if (!saving) onClose(); }}
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
            readOnly={!editable || saving}
            onChange={(e) => setDrafts((prev) => ({ ...prev, [section.key]: e.target.value }))}
          />
          <Sources>
            <SourcesLabel>출처</SourcesLabel>
            {section.sources.map((kind) => (
              <EvidenceTag key={kind} kind={kind} size="lg" />
            ))}
          </Sources>
        </Editor>

        {!editable && <LastEdited>이 항목은 자료와 인터뷰를 근거로 자동 정리되어 직접 편집할 수 없어요.</LastEdited>}
        {error && <ErrorText role="alert">{error}</ErrorText>}
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
          <SubmitButton type="button" style={{ width: 150 }} disabled={saving} onClick={handleSave}>
            {saving ? '저장 중…' : '수정 저장'}
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

  ${media.mobile} {
    min-height: 0;
    padding-bottom: 20px;
  }
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 13px;

  /* 모바일: 섹션 칩을 가로 스크롤 */
  ${media.mobile} {
    flex-wrap: nowrap;
    gap: 8px;
    margin: 0 -16px;
    padding: 0 16px;
    overflow-x: auto;
    scrollbar-width: none;

    & > button {
      flex-shrink: 0;
    }
  }
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

  ${media.mobile} {
    min-height: 240px;
  }
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

const ErrorText = styled.p`
  margin: 12px 0 0;
  color: ${colors.required};
  font-size: 12px;
  line-height: 1.4;
`;
