import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from './Button';

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <span className="app-logo">TaskFlow</span>
          <nav className="app-nav">
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Dashboard
            </NavLink>
            <NavLink to="/projects" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Projects
            </NavLink>
            <NavLink to="/tasks" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Tasks
            </NavLink>
          </nav>
          <div className="app-header-user">
            <span className="user-email">{user?.email}</span>
            <Button variant="secondary" onClick={handleLogout}>Log out</Button>
          </div>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}