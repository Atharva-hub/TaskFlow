import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { Layout } from './components/common/Layout';

function DashboardPlaceholder() {
  return <div>Dashboard coming in Lesson 5.</div>;
}
function ProjectsPlaceholder() {
  return <div>Projects coming in Lesson 4.</div>;
}
function TasksPlaceholder() {
  return <div>Tasks coming in Lesson 4.</div>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPlaceholder />} />
        <Route path="/projects" element={<ProjectsPlaceholder />} />
        <Route path="/tasks" element={<TasksPlaceholder />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;