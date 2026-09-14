import { Link } from 'react-router-dom';
import type { Project } from '../../types/models';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link to={`/projects/${project.id}`} className="project-card">
      <div className="project-card-header">
        <h3>{project.name}</h3>
        <span className={`status-badge status-${project.status.toLowerCase()}`}>
          {project.status === 'ACTIVE' ? 'Active' : 'Archived'}
        </span>
      </div>
      <p className="project-card-desc">{project.description}</p>
    </Link>
  );
}