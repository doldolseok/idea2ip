import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ProjectListItem, { CreateProjectItem } from '../components/ProjectListItem';
import { useNewProjectModal } from '../hooks/useNewProjectModal';
import { useProjectStore } from '../store/projectStore';
import type { ProjectStatus } from '../types/project';
import { colors } from '../styles/theme';

type Filter = 'all' | ProjectStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'in-progress', label: '진행 중' },
  { value: 'done', label: '완료' },
];

// 내 프로젝트
// - 프로젝트 없음: "새 프로젝트 만들기" 카드만
// - 프로젝트 있음: 프로젝트 목록 + 맨 아래 "새 프로젝트 만들기" 카드
// - 카드 / "열기" 클릭 → 프로젝트 상세(/projects/:projectId, ProjectDetailPage)

export default function MyProjectsPage() {
  const navigate = useNavigate();
  const projects = useProjectStore((state) => state.projects);
  const [filter, setFilter] = useState<Filter>('all');
  const { openModal, modalNode } = useNewProjectModal();

  const visibleProjects =
    filter === 'all' ? projects : projects.filter((project) => project.status === filter);

  const countOf = (value: Filter) =>
    value === 'all' ? projects.length : projects.filter((p) => p.status === value).length;

  return (
    <Page>
      <Content>
        <Header>
          <TitleGroup>
            <Title>내 프로젝트</Title>
            <Subtitle>등록 준비 중인 미술 창작 프로젝트를 한곳에서 확인해요</Subtitle>
          </TitleGroup>
          <Chips role="group" aria-label="프로젝트 상태 필터">
            {FILTERS.map(({ value, label }) => (
              <Chip
                key={value}
                type="button"
                aria-pressed={filter === value}
                $active={filter === value}
                onClick={() => setFilter(value)}
              >
                {label} {countOf(value)}
              </Chip>
            ))}
          </Chips>
        </Header>

        <List>
          {visibleProjects.map((project) => (
            <ProjectListItem
              key={project.id}
              project={project}
              onOpen={(id) => navigate(`/projects/${id}`)}
            />
          ))}
          <CreateProjectItem onCreate={openModal} />
        </List>
      </Content>

      {modalNode}
    </Page>
  );
}

/* 제목 기준 위 80px, 사이드바와 50px */
const Page = styled.div`
  padding: 80px 50px 60px;
`;

/* 카드 목록은 제목보다 12px 왼쪽에서 시작 (Figma 기준) */
const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
  margin-left: -12px;
`;

const Header = styled.section`
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 0 12px;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
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

const Chips = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const Chip = styled.button<{ $active: boolean }>`
  padding: 6px 14px;
  font-size: 14px;
  line-height: normal;
  white-space: nowrap;
  color: ${({ $active }) => ($active ? colors.primary : colors.chipInactiveText)};
  background: ${({ $active }) => ($active ? colors.selectedBg : colors.chipInactiveBg)};
  border: 0;
  border-radius: 20px;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;
