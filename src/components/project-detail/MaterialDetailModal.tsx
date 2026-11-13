import { useEffect, useRef, useState } from 'react';
import ModalShell from '../modal/ModalShell';
import { deleteMaterial, getMaterial } from '../../api/materials';
import type { MaterialDetail } from '../../api/materials';
import { MATERIAL_TYPES } from '../../constants/materialTypes';
import { useProjectStore } from '../../store/projectStore';
import MaterialImage from './MaterialImage';
import styled from 'styled-components';
import StatusMessage, { StatusButton } from '../StatusMessage';
import { CancelButton, ModalActions } from '../modal/modalForm.styles';
import { colors } from '../../styles/theme';

export default function MaterialDetailModal({ projectId, materialId, onClose, onDeleted }: {
  projectId: string; materialId: string; onClose: () => void; onDeleted: () => void;
}) {
  const [attempt, setAttempt] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const deleteLock = useRef(false);
  const handleDelete = async () => {
    if (deleteLock.current) return;
    if (!window.confirm('이 창작 자료를 삭제할까요? 첨부 이미지도 함께 삭제됩니다.')) return;
    deleteLock.current = true;
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteMaterial(materialId);
      useProjectStore.setState((state) => ({ materialsByProjectId: {
        ...state.materialsByProjectId,
        [projectId]: (state.materialsByProjectId[projectId] ?? []).filter((item) => item.id !== materialId),
      } }));
      onDeleted();
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : '자료를 삭제하지 못했습니다.');
    } finally {
      deleteLock.current = false;
      setDeleting(false);
    }
  };
  const [result, setResult] = useState<{ attempt: number; detail?: MaterialDetail; error?: string }>();
  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem('accessToken');
    getMaterial(materialId, controller.signal).then((detail) => {
      if (controller.signal.aborted) return;
      if (localStorage.getItem('accessToken') !== token) {
        setResult({ attempt, error: '로그인 상태가 변경되었습니다. 다시 로그인해주세요.' });
        return;
      }
      useProjectStore.setState((state) => ({ materialsByProjectId: {
        ...state.materialsByProjectId,
        [projectId]: (state.materialsByProjectId[projectId] ?? []).map((item) => item.id === materialId ? { ...item, ...detail } : item),
      } }));
      setResult({ attempt, detail });
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setResult({ attempt, error: error instanceof Error ? error.message : '자료 정보를 불러오지 못했습니다.' });
    });
    return () => controller.abort();
  }, [projectId, materialId, attempt]);
  const current = result?.attempt === attempt ? result : undefined;
  const detail = current?.detail;
  return (
    <ModalShell titleId="material-detail-title" title="창작 자료 상세" onClose={() => { if (!deleteLock.current) onClose(); }} width={598}>
      <Body>
      {!current ? <StatusMessage message="자료 정보를 불러오는 중입니다." /> : current.error ? (
        <StatusMessage role="alert" message={current.error}
          action={<StatusButton type="button" onClick={() => setAttempt((value) => value + 1)}>다시 시도</StatusButton>} />
      ) : detail && (
        <>
        <List>
          <Item><dt>자료 제목</dt><dd>{detail.title}</dd></Item>
          <Item><dt>자료 유형</dt><dd>{MATERIAL_TYPES.find((item) => item.value === detail.type)?.label}</dd></Item>
          <Item><dt>설명</dt><dd>{detail.description || '미입력'}</dd></Item>
          <Item><dt>사용한 AI 도구</dt><dd>{detail.aiTool || '미입력'}</dd></Item>
          <Item><dt>실제 제작 날짜</dt><dd>{detail.productionDate || '미입력'}</dd></Item>
          <Item><dt>첨부 이미지</dt><dd>{detail.files?.length ? <Files>{detail.files.map((file) => <li key={file.fileId}>
            <Preview><MaterialImage materialId={materialId} fileId={file.fileId} fileName={file.fileName} /></Preview>
            <FileName>{file.fileName}</FileName>
          </li>)}</Files> : '없음'}</dd></Item>
        </List>
        {deleteError && <StatusMessage role="alert" message={deleteError} />}
        <ModalActions>
          <CancelButton type="button" onClick={() => { if (!deleteLock.current) onClose(); }}>닫기</CancelButton>
          <DeleteButton type="button" disabled={deleting} onClick={handleDelete}>
            {deleting ? '삭제 중…' : '창작 자료 삭제'}
          </DeleteButton>
        </ModalActions>
        </>
      )}
      </Body>
    </ModalShell>
  );
}

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0 28px;
`;

const List = styled.dl`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
`;

/* 모달 입력칸 라벨(14px 굵게) + 값(13px)과 같은 글자 스타일 */
const Item = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  dt {
    color: ${colors.text};
    font-size: 14px;
    font-weight: 600;
  }

  dd {
    margin: 0;
    color: ${colors.textSecondary};
    font-size: 13px;
    line-height: 1.5;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
`;

const Files = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Preview = styled.div`
  display: flex;
  justify-content: center;
  padding: 8px;
  background: ${colors.softBlueBg};
  border: 1px solid ${colors.softBlueBorder};
  border-radius: 10px;
`;

const FileName = styled.p`
  margin: 6px 0 0;
  color: ${colors.textSecondary};
  font-size: 12px;
  overflow-wrap: anywhere;
`;

/* 디자인에 없는 삭제 버튼: 취소 버튼 모양 + 경고색 글자 */
const DeleteButton = styled(CancelButton)`
  color: ${colors.required};

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`;
