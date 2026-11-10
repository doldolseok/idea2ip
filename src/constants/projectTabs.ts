import processIcon from '../assets/tab-process.svg';
import finalIcon from '../assets/tab-final.svg';
import interviewIcon from '../assets/tab-interview.svg';
import contributionIcon from '../assets/tab-contribution.svg';
import reportIcon from '../assets/tab-report.svg';

/** 프로젝트 상세 상단 탭 (아이콘 크기는 Figma SVG 원본 크기) */
export const PROJECT_TABS = [
  { key: 'process', label: '제작 과정', icon: processIcon, width: 19.8, height: 17.87 },
  { key: 'final', label: '최종 작품', icon: finalIcon, width: 19.8, height: 17.87 },
  { key: 'interview', label: 'AI 인터뷰', icon: interviewIcon, width: 19.8, height: 17.87 },
  { key: 'contribution', label: '창작 기여 정리', icon: contributionIcon, width: 21.8, height: 19.66 },
  { key: 'report', label: '리포트', icon: reportIcon, width: 17.8, height: 19.66 },
] as const;

export type ProjectTabKey = (typeof PROJECT_TABS)[number]['key'];

export const DEFAULT_PROJECT_TAB: ProjectTabKey = 'process';

export const isProjectTabKey = (value: string | null): value is ProjectTabKey =>
  PROJECT_TABS.some((tab) => tab.key === value);
