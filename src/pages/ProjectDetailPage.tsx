import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import StatusBadge from '../components/StatusBadge';
import ProjectTabs from '../components/project-detail/ProjectTabs';
import ProcessTab from '../components/project-detail/ProcessTab';
import TabPlaceholder from '../components/project-detail/TabPlaceholder';
import { DEFAULT_PROJECT_TAB, PROJECT_TABS, isProjectTabKey } from '../constants/projectTabs';
import type { ProjectTabKey } from '../constants/projectTabs';
import { useProjectStore } from '../store/projectStore';
import { colors } from '../styles/theme';

// 프로젝트 상세 (/projects/:projectId?tab=process)
// 탭별 내용 컴포넌트를 만들면 아래 renderTabContent에 추가

function renderTabContent(tab: ProjectTabKey, projectId: string) {
  switch (tab) {
    case 'process':
      return <ProcessTab projectId={projectId} />;
    default:
      return <TabPlaceholder label={PROJECT_TABS.find((t) => t.key === tab)?.label ?? ''} />;
  }
}

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const project = useProjectStore((state) => state.projects.find((p) => p.id === projectId));
  const [searchParams, setSearchParams] = useSearchParams();

  // 선택한 탭은 URL(?tab=)에 저장 → 새로고침/뒤로가기에도 유지
  const tabParam = searchParams.get('tab');
  const activeTab = isProjectTabKey(tabParam) ? tabParam : DEFAULT_PROJECT_TAB;

  // 없는 프로젝트(잘못된 주소 등)는 내 프로젝트 목록으로
  if (!project) return <Navigate to="/projects" replace />;

  return (
    <Page>
      <Content>
        <Header>
          <TitleRow>
            <Title>{project.title}</Title>
            <StatusBadge status={project.status} />
          </TitleRow>
          <Subtitle>등록 준비 중인 미술 창작 프로젝트를 한곳에서 확인해요</Subtitle>
        </Header>

        <ProjectTabs
          activeTab={activeTab}
          onChange={(tab) => setSearchParams({ tab }, { replace: true })}
        />

        <TabPanel
          role="tabpanel"
          id={`project-tabpanel-${activeTab}`}
          aria-labelledby={`project-tab-${activeTab}`}
        >
          {renderTabContent(activeTab, project.id)}
        </TabPanel>
      </Content>
    </Page>
  );
}

/* 제목 위 80px, 사이드바와 50px */
const Page = styled.div`
  padding: 80px 50px 60px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 40px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const Title = styled.h1`
  margin: 0;
  color: ${colors.text};
  font-size: 28px;
  font-weight: 700;
  line-height: 1.4;
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${colors.muted};
  font-size: 14px;
  line-height: normal;
`;

/* 탭 바와 카드 사이 약 40.89px (Figma 기준) */
const TabPanel = styled.div`
  margin-top: 40.89px;
`;
