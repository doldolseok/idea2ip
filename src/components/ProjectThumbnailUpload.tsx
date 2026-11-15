import { useRef, useState } from 'react';
import styled from 'styled-components';
import { uploadProjectThumbnail } from '../api/projects';
import { isSupportedImage, SUPPORTED_IMAGE_ACCEPT } from '../utils/image';
import { useProjectStore } from '../store/projectStore';
import type { Project } from '../types/project';
import { SoftButton } from './project-detail/final-work/finalWork.styles';
import { colors, media } from '../styles/theme';

// 프로젝트 상세 헤더 오른쪽: 썸네일 등록·교체 (Figma에 없는 UI라 기존 보조 버튼 스타일 재사용)

export default function ProjectThumbnailUpload({ project }: { project: Project }) {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const lock = useRef(false);
  const picker = useRef<HTMLInputElement>(null);
  const save = async () => {
    if (!file || lock.current) return;
    lock.current = true; setBusy(true); setMessage('');
    const token = localStorage.getItem('accessToken');
    try {
      const result = await uploadProjectThumbnail(project.id, file);
      if (localStorage.getItem('accessToken') !== token) throw new Error('로그인 상태가 변경되었습니다.');
      useProjectStore.setState((state) => ({ projects: state.projects.some((item) => item.id === project.id)
        ? state.projects.map((item) => item.id === project.id ? { ...item, thumbnailUrl: result.thumbnailUrl } : item)
        : [...state.projects, { ...project, thumbnailUrl: result.thumbnailUrl }],
      }));
      setFile(null); if (picker.current) picker.current.value = '';
      setMessage('프로젝트 썸네일을 저장했습니다.');
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : '썸네일 저장에 실패했습니다.'); }
    finally { lock.current = false; setBusy(false); }
  };
  return (
    <Wrap aria-label="프로젝트 썸네일 등록 및 교체" aria-busy={busy}>
      <Controls>
        <HiddenInput id="project-thumbnail" ref={picker} type="file" accept={SUPPORTED_IMAGE_ACCEPT} disabled={busy} onChange={(event) => {
          const selected = event.target.files?.[0];
          if (!selected) return;
          if (!selected.size || !isSupportedImage(selected)) { setMessage('비어 있지 않은 JPG 또는 PNG 파일을 선택해주세요.'); event.target.value = ''; setFile(null); return; }
          setFile(selected); setMessage('');
        }} />
        <Button as="label" htmlFor="project-thumbnail" aria-disabled={busy}>
          {file ? '다른 이미지' : '썸네일 변경'}
        </Button>
        {file && (
          <Button type="button" disabled={busy} onClick={save}>{busy ? '저장 중…' : '썸네일 저장'}</Button>
        )}
      </Controls>
      {file && <FileName title={file.name}>{file.name}</FileName>}
      {message && <Message role="status">{message}</Message>}
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  min-width: 0;
  max-width: 100%;

  ${media.mobile} {
    align-items: flex-start;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 8px;
`;

/* 키보드 포커스는 label 버튼 대신 실제 input이 받도록 화면에서만 숨김 */
const HiddenInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;

  &:focus-visible + label {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

const Button = styled(SoftButton)`
  cursor: pointer;

  &[aria-disabled='true'],
  &:disabled {
    color: ${colors.disabledText};
    cursor: not-allowed;
  }
`;

const FileName = styled.p`
  max-width: 240px;
  margin: 0;
  overflow: hidden;
  color: ${colors.textSecondary};
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Message = styled.p`
  max-width: 240px;
  margin: 0;
  color: ${colors.textSecondary};
  font-size: 12px;
  text-align: right;

  ${media.mobile} {
    text-align: left;
  }
`;
