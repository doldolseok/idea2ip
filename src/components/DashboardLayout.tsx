import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f7f9fc;
`;

const Main = styled.main`
  flex: 1;
  position: relative;
  min-width: 0;
`;

export default function DashboardLayout() {
  return (
    <Wrapper>
      <Sidebar />
      <Main>
        <Outlet />
      </Main>
    </Wrapper>
  );
}
