import { Link, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import StatusBadge from '../components/StatusBadge';
import ProjectTabs from '../components/project-detail/ProjectTabs';
import ProcessTab from '../components/project-detail/ProcessTab';
import TabPlaceholder from '../components/project-detail/TabPlaceholder';
import FinalWorkTab from '../components/project-detail/final-work/FinalWorkTab';
import InterviewTab from '../components/project-detail/interview/InterviewTab';
import ContributionTab from '../components/project-detail/contribution/ContributionTab';
import ReportTab from '../components/project-detail/report/ReportTab';
import type { Project } from '../types/project';
import { DEFAULT_PROJECT_TAB, PROJECT_TABS, isProjectTabKey } from '../constants/projectTabs';
import type { ProjectTabKey } from '../constants/projectTabs';
import { useProjectStore } from '../store/projectStore';
import { colors, media, pagePadding } from '../styles/theme';
import { useProjectDetail } from '../hooks/useProjectDetail';
import ProjectThumbnailUpload from '../components/ProjectThumbnailUpload';
import StatusMessage, { StatusButton } from '../components/StatusMessage';

// 프로젝트 상세 (/projects/:projectId?tab=process)
// 탭별 내용 컴포넌트를 만들면 아래 renderTabContent에 추가

function renderTabContent(
  tab: ProjectTabKey,
  project: Project,
  changeTab: (tab: ProjectTabKey) => void,
) {
  switch (tab) {
    case 'process':
      return <ProcessTab projectId={project.id} />;
    case 'final':
      // key: 프로젝트가 바뀌면 입력 중이던 값 초기화
      return (
        <FinalWorkTab
          key={project.id}
          project={project}
          onGoToInterview={() => changeTab('interview')}
        />
      );
    case 'interview':
      return <InterviewTab key={project.id} projectId={project.id} onChangeTab={changeTab} />;
    case 'contribution':
      return <ContributionTab key={project.id} projectId={project.id} onChangeTab={changeTab} />;
    case 'report':
      return <ReportTab key={project.id} project={project} />;
    default:
      return <TabPlaceholder label={PROJECT_TABS.find((t) => t.key === tab)?.label ?? ''} />;
  }
}

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const listProject = useProjectStore((state) => state.projects.find((p) => p.id === projectId));
  const detail = useProjectDetail(projectId ?? '');
  const project = detail.project ? {
    ...listProject,
    ...detail.project,
    updatedAt: listProject?.updatedAt ?? detail.project.updatedAt,
    status: listProject?.status ?? detail.project.status,
  } : undefined;
  const [searchParams, setSearchParams] = useSearchParams();

  // 선택한 탭은 URL(?tab=)에 저장 → 새로고침/뒤로가기에도 유지
  const tabParam = searchParams.get('tab');
  const activeTab = isProjectTabKey(tabParam) ? tabParam : DEFAULT_PROJECT_TAB;

  const changeTab = (tab: ProjectTabKey) => setSearchParams({ tab }, { replace: true });

  if (detail.loading) return <Page><StatusMessage message="프로젝트 정보를 불러오는 중입니다." /></Page>;
  if (!project) return (
    <Page>
      <StatusMessage
        role="alert"
        message={detail.error}
        action={detail.status === 401 ? <StatusButton as={Link} to="/login">로그인하기</StatusButton> : (
          <FeedbackActions>
            <StatusButton type="button" onClick={detail.retry}>다시 시도</StatusButton>
            <StatusButton as={Link} to="/projects">내 프로젝트로 이동</StatusButton>
          </FeedbackActions>
        )}
      />
    </Page>
  );

  return (
    <Page>
      <Content>
        <Header>
          <HeaderText>
            <TitleRow>
              <Title>{project.title}</Title>
              <StatusBadge status={project.status} />
            </TitleRow>
            <Subtitle>등록 준비 중인 미술 창작 프로젝트를 한곳에서 확인해요</Subtitle>
            {project.description && <Subtitle>{project.description}</Subtitle>}
          </HeaderText>
          <ProjectThumbnailUpload key={project.id} project={project} />
        </Header>

        <ProjectTabs
          activeTab={activeTab}
          onChange={changeTab}
        />

        <TabPanel
          role="tabpanel"
          id={`project-tabpanel-${activeTab}`}
          aria-labelledby={`project-tab-${activeTab}`}
        >
          {renderTabContent(activeTab, project, changeTab)}
        </TabPanel>
      </Content>
    </Page>
  );
}

/* 제목 위 80px, 사이드바와 50px */
const Page = styled.div`
  ${pagePadding}
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

/* 제목 영역 + 오른쪽 썸네일 변경 버튼(디자인에 없는 UI, 제목 영역 높이를 늘리지 않게 오른쪽에 둠) */
const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 40px;

  ${media.mobile} {
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
  }
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
`;

const FeedbackActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 18px;
`;

const Title = styled.h1`
  margin: 0;
  word-break: keep-all;
  color: ${colors.text};
  font-size: 28px;
  font-weight: 700;
  line-height: 1.4;
  overflow-wrap: anywhere;

  ${media.mobile} {
    font-size: 24px;
  }
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

  ${media.tablet} {
    margin-top: 32px;
  }

  ${media.mobile} {
    margin-top: 24px;
  }
`;
