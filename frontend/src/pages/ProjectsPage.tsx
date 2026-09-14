import { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectForm } from '../components/projects/ProjectForm';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';

export function ProjectsPage() {
  const { projects, isLoading, error, refetch, createProject } = useProjects();
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreate(values: { name: string; description: string }) {
    await createProject(values);
    setIsCreating(false);
  }

  return (
    <div>
      <div className="page-header">
        <h1>Projects</h1>
        <Button onClick={() => setIsCreating(true)}>New project</Button>
      </div>

      {isLoading && <LoadingState label="Loading projects..." />}
      {!isLoading && error && <ErrorState message={error} onRetry={refetch} />}

      {!isLoading && !error && projects.length === 0 && (
        <EmptyState
          title="No projects yet"
          description="Create your first project to start organizing tasks."
          action={<Button onClick={() => setIsCreating(true)}>New project</Button>}
        />
      )}

      {!isLoading && !error && projects.length > 0 && (
        <div className="project-grid">
          {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      )}

      {isCreating && (
        <Modal title="New project" onClose={() => setIsCreating(false)}>
          <ProjectForm onSubmit={handleCreate} onCancel={() => setIsCreating(false)} submitLabel="Create" />
        </Modal>
      )}
    </div>
  );
}