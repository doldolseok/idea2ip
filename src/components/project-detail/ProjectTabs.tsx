import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { PROJECT_TABS } from '../../constants/projectTabs';
import type { ProjectTabKey } from '../../constants/projectTabs';
import { colors, media } from '../../styles/theme';

interface Props {
  activeTab: ProjectTabKey;
  onChange: (tab: ProjectTabKey) => void;
}

// 프로젝트 상세 상단 탭 바 (제작 과정 / 최종 작품 / AI 인터뷰 / 창작 기여 정리 / 리포트)

export default function ProjectTabs({ activeTab, onChange }: Props) {
  const listRef = useRef<HTMLDivElement>(null);

  // 모바일 가로 스크롤: 선택된 탭이 탭 바 가운데에 보이도록 (탭 바만 스크롤, 페이지는 그대로)
  useEffect(() => {
    const list = listRef.current;
    const tab = list?.querySelector<HTMLElement>(`#project-tab-${activeTab}`);
    if (!list || !tab || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <TabList ref={listRef} role="tablist" aria-label="프로젝트 상세 메뉴">
      {PROJECT_TABS.map(({ key, label, icon, width, height }) => {
        const active = key === activeTab;
        return (
          <Tab
            key={key}
            id={`project-tab-${key}`}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={`project-tabpanel-${key}`}
            $active={active}
            onClick={() => onChange(key)}
          >
            {/* SVG를 마스크로 써서 선택 여부에 따라 아이콘 색만 바꿈 */}
            <TabIcon aria-hidden="true" $src={icon} style={{ width, height }} />
            {label}
          </Tab>
        );
      })}
    </TabList>
  );
}

const TabList = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6.5px;
  height: 100px;
  padding: 8px 12px;
  background: ${colors.tabBarBg};
  border: 1px solid ${colors.tabBarBorder};
  border-radius: 16px;

  /* 모바일: 탭을 고정 폭으로 두고 가로 스크롤 */
  ${media.mobile} {
    position: relative;
    display: flex;
    gap: 6px;
    height: 84px;
    padding: 8px;
    overflow-x: auto;
    scrollbar-width: none;
    scroll-padding: 0 8px;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-width: 0;
  color: ${({ $active }) => ($active ? colors.primary : colors.textSecondary)};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  line-height: normal;
  white-space: nowrap;
  background: ${({ $active }) => ($active ? colors.card : 'transparent')};
  border: 1px solid ${({ $active }) => ($active ? colors.tabActiveBorder : 'transparent')};
  border-radius: 12px;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s;

  &:hover {
    color: ${colors.primary};
  }

  ${media.mobile} {
    flex: 0 0 auto;
    min-width: 100px;
    padding: 0 12px;
    gap: 10px;
  }
`;

const TabIcon = styled.span<{ $src: string }>`
  display: block;
  flex-shrink: 0;
  background-color: currentColor;
  /* Vite가 작은 SVG를 data URL로 인라인하므로 따옴표 필수 */
  mask: url("${({ $src }) => $src}") center / contain no-repeat;
  -webkit-mask: url("${({ $src }) => $src}") center / contain no-repeat;
`;
