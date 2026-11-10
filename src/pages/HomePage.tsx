import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import plusIcon from '../assets/Vector.svg';
import emptyFolderIcon from '../assets/empty-folder.svg';
import creationMaterialsIcon from '../assets/creation-materials.svg';
import aiInterviewIcon from '../assets/ai-interview.svg';
import copyrightBriefIcon from '../assets/copyright-brief.svg';
import NewProjectModal from '../components/NewProjectModal';
import type { NewProjectInput } from '../components/NewProjectModal';
import ProjectCard from '../components/ProjectCard';
import type { ProjectSummary } from '../components/ProjectCard';
import LibraryCard from '../components/LibraryCard';
import { getWorkTypeLabel } from '../constants/workTypes';

// TODO: 백엔드 API 연동 시 TanStack Query(useQuery)로 교체 (현재는 Figma 시안 확인용 더미 데이터)
const INITIAL_PROJECTS: ProjectSummary[] = [
  { id: '1', title: '제목제목제목', category: '포스터 디자인', status: '진행 중', updatedAt: '2026.10.15' },
  { id: '2', title: '제목제목제목', category: '포스터 디자인', status: '진행 중', updatedAt: '2026.10.15' },
  { id: '3', title: '제목제목제목', category: '포스터 디자인', status: '진행 중', updatedAt: '2026.10.15' },
];

// TODO: 자료실 개수도 API 연동 시 교체
const library = [
  { key: 'materials', label: '제작 자료', icon: creationMaterialsIcon, count: 3 },
  { key: 'interview', label: 'AI 인터뷰', icon: aiInterviewIcon, count: 3 },
  { key: 'brief', label: 'Copyright Brief', icon: copyrightBriefIcon, count: 3 },
];

/** 2026.11.11 형식 */
const formatDate = (date: Date) =>
  [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((n) => String(n).padStart(2, '0'))
    .join('.');

const Page = styled.div`
  padding: 80px 50px 60px;
  display: flex;
  flex-direction: column;
  gap: 46px;
`;

const Header = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 50px;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Title = styled.h1`
  margin: 0;
  color: #131c33;
  font-family: Pretendard, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 39.2px;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #68758d;
  font-family: Pretendard, sans-serif;
  font-size: 18px;
  font-weight: 500;
  line-height: 25.2px;
`;

const NewProjectButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 40px;
  border: none;
  border-radius: 10px;
  background: #3569eb;
  color: #ffffff;
  font-family: Pretendard, sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: 25.2px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #2c5bd4;
  }
`;

const PlusImg = styled.img`
  width: 14px;
  height: 14px;
`;

const Sections = styled.div`
  display: flex;
  flex-direction: column;
  gap: 36px;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  padding: 0 12px;
  color: #131c33;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
`;

const ProjectRow = styled.div`
  display: flex;
  align-items: center;
  gap: 36px;
  overflow-x: auto;
`;

const LibraryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
`;

const EmptyState = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 17px;
  pointer-events: none;
`;

const EmptyIcon = styled.img`
  width: 109px;
  height: 109px;
`;

const EmptyText = styled.p`
  margin: 0;
  color: rgba(104, 117, 141, 0.3);
  font-family: Pretendard, sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 33.6px;
  white-space: nowrap;
`;

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 임시: 화면 상태로만 관리 (새로고침하면 초기화됨)
  const [projects, setProjects] = useState<ProjectSummary[]>(INITIAL_PROJECTS);
  const thumbnailUrls = useRef<string[]>([]);

  // 페이지를 벗어날 때 썸네일용 임시 URL 해제
  useEffect(() => {
    const urls = thumbnailUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const handleCreate = ({ name, image, workType }: NewProjectInput) => {
    // TODO: 프로젝트 생성 API 연동 후 useMutation + 목록 쿼리 invalidate 로 교체
    const thumbnailUrl = URL.createObjectURL(image);
    thumbnailUrls.current.push(thumbnailUrl);

    const newProject: ProjectSummary = {
      id: crypto.randomUUID(),
      title: name,
      category: getWorkTypeLabel(workType),
      status: '진행 중',
      updatedAt: formatDate(new Date()),
      thumbnailUrl,
    };

    // 최근 프로젝트 맨 앞에 추가
    setProjects((prev) => [newProject, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <>
      <Page>
        <Header>
          <TitleGroup>
            <Title>반가워요! 오늘도 창작의 과정을 정리해볼까요?</Title>
            <Subtitle>나의 창작을 권리로 정리하세요.</Subtitle>
          </TitleGroup>
          <NewProjectButton type="button" onClick={() => setIsModalOpen(true)}>
            <PlusImg src={plusIcon} alt="" />새 프로젝트
          </NewProjectButton>
        </Header>

        {projects.length > 0 && (
          <Sections>
            <Section>
              <SectionTitle>최근 프로젝트</SectionTitle>
              <ProjectRow>
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </ProjectRow>
            </Section>
            <Section>
              <SectionTitle>자료실</SectionTitle>
              <LibraryRow>
                {library.map(({ key, ...item }) => (
                  <LibraryCard key={key} {...item} />
                ))}
              </LibraryRow>
            </Section>
          </Sections>
        )}
      </Page>

      {projects.length === 0 && (
        <EmptyState>
          <EmptyIcon src={emptyFolderIcon} alt="" />
          <EmptyText>아직 등록된 프로젝트가 없어요</EmptyText>
        </EmptyState>
      )}

      {isModalOpen && (
        <NewProjectModal onClose={() => setIsModalOpen(false)} onSubmit={handleCreate} />
      )}
    </>
  );
}
