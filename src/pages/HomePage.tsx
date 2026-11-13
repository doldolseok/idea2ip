import styled from 'styled-components';
import { media, pagePadding } from '../styles/theme';
import plusIcon from '../assets/Vector.svg';
import emptyFolderIcon from '../assets/empty-folder.svg';
import creationMaterialsIcon from '../assets/creation-materials.svg';
import aiInterviewIcon from '../assets/ai-interview.svg';
import copyrightBriefIcon from '../assets/copyright-brief.svg';
import ProjectCard from '../components/ProjectCard';
import LibraryCard from '../components/LibraryCard';
import PrimaryButton from '../components/PrimaryButton';
import { useNewProjectModal } from '../hooks/useNewProjectModal';
import { useProjectStore } from '../store/projectStore';

/** 최근 프로젝트에 보여줄 개수 (Figma: 한 줄에 3개, 화면 너비에 맞춰 늘어남) */
const RECENT_PROJECT_COUNT = 3;

// TODO: 자료실 개수도 API 연동 시 교체
const library = [
  { key: 'materials', label: '제작 자료', icon: creationMaterialsIcon, count: 3 },
  { key: 'interview', label: 'AI 인터뷰', icon: aiInterviewIcon, count: 3 },
  { key: 'brief', label: 'Copyright Brief', icon: copyrightBriefIcon, count: 3 },
];

const Page = styled.div`
  ${pagePadding}
  display: flex;
  flex-direction: column;
  gap: 46px;
`;

const Header = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 50px;

  ${media.mobile} {
    gap: 28px;
  }
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Title = styled.h1`
  margin: 0;
  word-break: keep-all;
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
  display: grid;
  grid-template-columns: repeat(${RECENT_PROJECT_COUNT}, minmax(0, 1fr));
  gap: 36px;

  /* 태블릿: 2개씩, 모바일: 1개씩 (카드는 폭에 맞춰 늘어남) */
  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }

  ${media.mobile} {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }
`;

const LibraryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;

  ${media.tablet} {
    gap: 20px;
  }

  ${media.mobile} {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
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

  ${media.mobile} {
    font-size: 18px;
    line-height: 1.4;
  }
`;

export default function HomePage() {
  // 내 프로젝트 화면과 같은 데이터 (store/projectStore.ts)
  const projects = useProjectStore((state) => state.projects);
  const { openModal, modalNode } = useNewProjectModal();

  return (
    <>
      <Page>
        <Header>
          <TitleGroup>
            <Title>반가워요! 오늘도 창작의 과정을 정리해볼까요?</Title>
            <Subtitle>나의 창작을 권리로 정리하세요.</Subtitle>
          </TitleGroup>
          <PrimaryButton type="button" onClick={openModal}>
            <PlusImg src={plusIcon} alt="" />새 프로젝트
          </PrimaryButton>
        </Header>

        {projects.length > 0 && (
          <Sections>
            <Section>
              <SectionTitle>최근 프로젝트</SectionTitle>
              <ProjectRow>
                {projects.slice(0, RECENT_PROJECT_COUNT).map((project) => (
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

      {modalNode}
    </>
  );
}
