import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import { ProjectsPage } from './pages/Projects';
import { Workspace } from './pages/Workspace';

export default function App() {
  const { activeProjectId, projects } = useStore();
  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProjectsPage />} />
        <Route path="/workspace/:projectId/*" element={activeProject ? <Workspace /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
