import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import LogoImage from '../assets/LogoImage.png';
import dashboardIcon from '../assets/dashboard.svg';
import folderOpenIcon from '../assets/folder-open.svg';
import folderPlusIcon from '../assets/folder-plus.svg';
import bookOpenIcon from '../assets/book-open.svg';

const NAV_ITEMS = [
  { to: '/', label: '대시보드', icon: dashboardIcon, end: true },
  { to: '/projects', label: '내 프로젝트', icon: folderOpenIcon, end: false },
  { to: '/projects/new', label: '새 프로젝트', icon: folderPlusIcon, end: true },
  { to: '/guide', label: '사용 가이드', icon: bookOpenIcon, end: false },
];

/** 사이드바 너비. 메인 영역만 덮는 오버레이(새 프로젝트 모달 등)에서 사용 */
export const SIDEBAR_WIDTH = 276;

const Aside = styled.aside`
  width: ${SIDEBAR_WIDTH}px;
  flex-shrink: 0;
  min-height: 100vh;
  padding: 40px 14px;
  background: #ffffff;
  border-right: 1px solid #eef1f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 43px;
`;

const LogoImg = styled.img`
  width: 173px;
  height: 47px;
  object-fit: contain;
`;

const Nav = styled.nav`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding: 12px 10px 12px 68px;
  border-radius: 10px;
  text-decoration: none;
  color: #68758d;
  font-family: Pretendard, sans-serif;
  font-size: 15px;
  font-weight: 500;
  line-height: 21px;
  transition: background 0.15s;

  &:hover {
    background: #f3f6fd;
  }

  &.active {
    background: #edf2ff;
  }
`;

const Icon = styled.img`
  width: 16px;
  height: 16px;
`;

export default function Sidebar() {
  return (
    <Aside>
      <LogoImg src={LogoImage} alt="Idea2IP" />
      <Nav>
        {NAV_ITEMS.map(({ to, label, icon, end }) => (
          <NavItem key={to} to={to} end={end}>
            <Icon src={icon} alt="" />
            <span>{label}</span>
          </NavItem>
        ))}
      </Nav>
    </Aside>
  );
}
