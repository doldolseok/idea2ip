import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ModalShell from '../../modal/ModalShell';
import { CancelButton, Field, FieldLabel, ModalActions, ModalChip, SubmitButton, TextArea } from '../../modal/modalForm.styles';
import StatusMessage, { StatusButton } from '../../StatusMessage';
import { colors } from '../../../styles/theme';
import { getContributionStep, updateContributions } from '../../../api/contributions';
import type { ContributionReview, ContributionStepDetail, ReviewContributionsInput } from '../../../api/contributions';

export default function ContributionReviewModal({ projectId, revision, stepId, onClose, onSaved }: {
  projectId: string; revision: number; stepId: number | null; onClose: () => void; onSaved: (review: ContributionReview) => void;
}) {
  const [baseRevision] = useState(revision);
  const [decision, setDecision] = useState<'EDIT' | 'EXCLUDE' | 'CONFIRM'>('CONFIRM');
  const [detail, setDetail] = useState<ContributionStepDetail>();
  const [loadError, setLoadError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [tools, setTools] = useState('');
  const [purpose, setPurpose] = useState('');
  const [usage, setUsage] = useState('');
  const [created, setCreated] = useState('');
  const [edited, setEdited] = useState('');
  const [clearAi, setClearAi] = useState(false);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const lock = useRef(false);
  useEffect(() => {
    if (stepId === null) return;
    const controller = new AbortController();
    getContributionStep(projectId, stepId, controller.signal).then((data) => {
      if (controller.signal.aborted) return;
      setDetail(data); setLoadError('');
      setTools(data.aiUsage?.tools.join('\n') ?? ''); setPurpose(data.aiUsage?.purpose ?? ''); setUsage(data.aiUsage?.outputUsage ?? '');
      setCreated(data.humanCreatedElements.join('\n')); setEdited(data.humanEdits.join('\n')); setClearAi(data.aiUsage === null);
    }).catch((cause: unknown) => { if (!controller.signal.aborted) setLoadError(cause instanceof Error ? cause.message : '상세 조회에 실패했습니다.'); });
    return () => controller.abort();
  }, [projectId, stepId, attempt]);
  const lines = (value: string) => value.split('\n').map((line) => line.trim()).filter(Boolean);
  const save = async () => {
    if (lock.current || (decision === 'EDIT' && stepId !== null && !detail)) return;
    const input: ReviewContributionsInput = { expectedRevision: baseRevision, changes: [] };
    if (stepId === null) {
      input.finalize = true;
      if (reason.trim()) input.noContributionReason = reason.trim();
    } else input.changes = [{ stepId, decision, ...(decision === 'EDIT' ? { edits: {
      aiUsage: clearAi ? null : { tools: lines(tools), purpose: purpose.trim() || null, outputUsage: usage.trim() || null },
      humanCreatedElements: lines(created), humanEdits: lines(edited),
    } } : {}) }];
    lock.current = true; setBusy(true); setError('');
    const token = localStorage.getItem('accessToken');
    try {
      const review = await updateContributions(projectId, input);
      if (localStorage.getItem('accessToken') !== token) throw new Error('로그인 상태가 변경되었습니다.');
      onSaved(review);
    } catch (cause) { setError(cause instanceof Error ? cause.message : '저장에 실패했습니다.'); }
    finally { lock.current = false; setBusy(false); }
  };
  const decisions = [['CONFIRM', '확정'], ['EDIT', '수정'], ['EXCLUDE', '제외']] as const;
  return <ModalShell titleId="contribution-review-title" title={stepId === null ? '기여 검토 전체 확정' : '기여 단계 검토'} width={680} shadow onClose={() => { if (!lock.current) onClose(); }}>
    <Form onSubmit={(event) => { event.preventDefault(); void save(); }} aria-busy={busy}>
      <Body disabled={busy}>
        {stepId === null ? <>
          <Hint>각 단계의 검토 결정을 저장한 뒤 전체 검토를 확정합니다.</Hint>
          <Field>
            <FieldLabel htmlFor="no-contribution-reason">확정할 기여가 없는 경우 사유</FieldLabel>
            <TextArea id="no-contribution-reason" maxLength={2000} value={reason} onChange={(event) => setReason(event.target.value)} />
          </Field>
        </> : <>
          <StepTitle>{detail?.title ?? `단계 ${stepId}`}</StepTitle>
          <Field role="radiogroup" aria-labelledby="contribution-decision-label">
            <FieldLabel as="p" id="contribution-decision-label">검토 결정</FieldLabel>
            <Chips>
              {decisions.map(([value, label]) => (
                <ModalChip key={value} type="button" role="radio" aria-checked={decision === value} $active={decision === value}
                  style={{ width: 96 }} onClick={() => setDecision(value)}>{label}</ModalChip>
              ))}
            </Chips>
          </Field>
          {decision === 'EXCLUDE' && <Hint>이 단계를 기여 검토에서 제외합니다. 원본 자료는 삭제하지 않습니다.</Hint>}
          {decision === 'EDIT' && (!detail ? (
            <StatusMessage role={loadError ? 'alert' : 'status'} message={loadError || '기존 내용을 불러오는 중입니다.'}
              action={loadError ? <StatusButton type="button" onClick={() => setAttempt((value) => value + 1)}>다시 조회</StatusButton> : undefined} />
          ) : <>
            <Hint>목록 항목은 줄마다 하나씩 입력합니다. 내용을 모두 지우고 저장하면 해당 목록이 비워집니다.</Hint>
            <CheckLabel><input type="checkbox" checked={clearAi} onChange={(event) => setClearAi(event.target.checked)} />AI 활용 정보 비우기</CheckLabel>
            {!clearAi && <>
              <Field><FieldLabel htmlFor="review-ai-tools">AI 도구</FieldLabel><TextArea id="review-ai-tools" value={tools} onChange={(event) => setTools(event.target.value)} /></Field>
              <Field><FieldLabel htmlFor="review-ai-purpose">활용 목적</FieldLabel><TextArea id="review-ai-purpose" value={purpose} onChange={(event) => setPurpose(event.target.value)} /></Field>
              <Field><FieldLabel htmlFor="review-ai-usage">산출물 활용</FieldLabel><TextArea id="review-ai-usage" value={usage} onChange={(event) => setUsage(event.target.value)} /></Field>
            </>}
            <Field><FieldLabel htmlFor="review-created">직접 창작한 요소</FieldLabel><TextArea id="review-created" value={created} onChange={(event) => setCreated(event.target.value)} /></Field>
            <Field><FieldLabel htmlFor="review-edited">직접 수정한 요소</FieldLabel><TextArea id="review-edited" value={edited} onChange={(event) => setEdited(event.target.value)} /></Field>
          </>)}
        </>}
        {error && <StatusMessage role="alert" message={error} />}
        <ModalActions>
          <CancelButton type="button" onClick={onClose}>취소</CancelButton>
          <SubmitButton type="submit" disabled={decision === 'EDIT' && stepId !== null && !detail}>{busy ? '저장 중…' : stepId === null ? '전체 검토 확정' : '검토 결정 저장'}</SubmitButton>
        </ModalActions>
      </Body>
    </Form>
  </ModalShell>;
}

const Form = styled.form`
  padding: 20px 0 28px;
`;

/* fieldset 기본 테두리 제거 (저장 중 전체 비활성화용) */
const Body = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
`;

const StepTitle = styled.h3`
  margin: 0;
  color: ${colors.text};
  font-size: 15px;
  font-weight: 700;
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Hint = styled.p`
  margin: 0;
  color: ${colors.muted};
  font-size: 13px;
  line-height: 1.5;
`;

const CheckLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  color: ${colors.text};
  font-size: 14px;
  cursor: pointer;

  input {
    width: 18px;
    height: 18px;
    accent-color: ${colors.selected};
  }
`;
