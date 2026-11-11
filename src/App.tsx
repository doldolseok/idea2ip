import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import GuidePage from './pages/GuidePage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MyProjectsPage from './pages/MyProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<MyProjectsPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="/guide" element={<GuidePage />} />
        {/* 이후: /projects/new 추가 */}
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
