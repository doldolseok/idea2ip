import { useCallback, useState } from 'react';
import NewProjectModal from '../components/NewProjectModal';
import type { NewProjectInput } from '../components/NewProjectModal';
import { useProjectStore } from '../store/projectStore';

/**
 * 새 프로젝트 생성 모달 (대시보드, 내 프로젝트에서 공통 사용)
 * const { openModal, modalNode } = useNewProjectModal();
 * <button onClick={openModal}>...</button> {modalNode}
 */
export function useNewProjectModal() {
  const [isOpen, setIsOpen] = useState(false);
  const addProject = useProjectStore((state) => state.addProject);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  const handleCreate = ({ name, image, workType }: NewProjectInput) => {
    // TODO: 프로젝트 생성 API 연동 후 useMutation + 목록 쿼리 invalidate 로 교체
    addProject({
      id: crypto.randomUUID(),
      title: name,
      workType,
      status: 'in-progress',
      updatedAt: new Date().toISOString(),
      // 임시 썸네일 URL (새로고침 전까지 유지)
      thumbnailUrl: URL.createObjectURL(image),
    });
    setIsOpen(false);
  };

  const modalNode = isOpen ? (
    <NewProjectModal onClose={closeModal} onSubmit={handleCreate} />
  ) : null;

  return { openModal, modalNode };
}
