import { Link } from 'react-router-dom';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { StatCard } from '../components/dashboard/StatCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/common/Button';
import { usePageTitle } from '../hooks/usePageTitle';

export function DashboardPage() {
  usePageTitle('Dashboard');
  const { stats, isLoading, error, refetch } = useDashboardStats();

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <Link to="/projects"><Button>Go to projects</Button></Link>
      </div>

      {isLoading && <LoadingState label="Loading dashboard..." />}
      {!isLoading && error && <ErrorState message={error} onRetry={refetch} />}

      {!isLoading && !error && stats && (
        <div className="stat-grid">
          <StatCard label="Projects" value={stats.totalProjects} />
          <StatCard label="Total tasks" value={stats.totalTasks} />
          <StatCard label="Completed" value={stats.completedTasks} tone="success" />
          <StatCard label="Pending" value={stats.pendingTasks} />
          <StatCard label="Overdue" value={stats.overdueTasks} tone="danger" />
        </div>
      )}
    </div>
  );
}