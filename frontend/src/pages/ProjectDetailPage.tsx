import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskForm } from '../components/tasks/TaskForm';
import { ProjectForm } from '../components/projects/ProjectForm';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import type { Task } from '../types/models';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, isLoading: projectsLoading, error: projectsError, updateProject, deleteProject } = useProjects();
  const { tasks, isLoading: tasksLoading, error: tasksError, refetch: refetchTasks, createTask, updateTask, deleteTask } = useTasks();

  const [isEditingProject, setIsEditingProject] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const project = projects.find((p) => p.id === id);
  const projectTasks = tasks.filter((t) => t.projectId === id);

  async function handleDeleteProject() {
    if (!project) return;
    if (!confirm(`Delete "${project.name}" and all its tasks? This cannot be undone.`)) return;
    await deleteProject(project.id);
    navigate('/projects');
  }

  async function handleDeleteTask(task: Task) {
    if (!confirm(`Delete "${task.title}"?`)) return;
    await deleteTask(task.id);
  }

  if (projectsLoading) return <LoadingState label="Loading project..." />;
  if (projectsError) return <ErrorState message={projectsError} />;
  if (!project) return <ErrorState message="Project not found." />;

  return (
    <div>
      <Link to="/projects" className="back-link">&larr; Back to projects</Link>

      <div className="page-header">
        <div>
          <h1>{project.name}</h1>
          <p className="project-detail-desc">{project.description}</p>
        </div>
        <div className="page-header-actions">
          <Button variant="secondary" onClick={() => setIsEditingProject(true)}>Edit project</Button>
          <Button variant="danger" onClick={handleDeleteProject}>Delete project</Button>
        </div>
      </div>

      <div className="page-header">
        <h2>Tasks</h2>
        <Button onClick={() => setIsCreatingTask(true)}>Add task</Button>
      </div>

      {tasksLoading && <LoadingState label="Loading tasks..." />}
      {!tasksLoading && tasksError && <ErrorState message={tasksError} onRetry={refetchTasks} />}
      {!tasksLoading && !tasksError && projectTasks.length === 0 && (
        <EmptyState
          title="No tasks yet"
          description="Add the first task for this project."
          action={<Button onClick={() => setIsCreatingTask(true)}>Add task</Button>}
        />
      )}
      {!tasksLoading && !tasksError && projectTasks.length > 0 && (
        <div className="task-list">
          {projectTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={(status) => updateTask(task.id, { status })}
              onEdit={() => setEditingTask(task)}
              onDelete={() => handleDeleteTask(task)}
            />
          ))}
        </div>
      )}

      {isEditingProject && (
        <Modal title="Edit project" onClose={() => setIsEditingProject(false)}>
          <ProjectForm
            initialValues={project}
            onSubmit={async (values) => { await updateProject(project.id, values); setIsEditingProject(false); }}
            onCancel={() => setIsEditingProject(false)}
            submitLabel="Save changes"
          />
        </Modal>
      )}

      {isCreatingTask && (
        <Modal title="Add task" onClose={() => setIsCreatingTask(false)}>
          <TaskForm
            onSubmit={async (values) => { await createTask({ ...values, projectId: project.id }); setIsCreatingTask(false); }}
            onCancel={() => setIsCreatingTask(false)}
            submitLabel="Create"
          />
        </Modal>
      )}

      {editingTask && (
        <Modal title="Edit task" onClose={() => setEditingTask(null)}>
          <TaskForm
            initialValues={editingTask}
            onSubmit={async (values) => { await updateTask(editingTask.id, values); setEditingTask(null); }}
            onCancel={() => setEditingTask(null)}
            submitLabel="Save changes"
          />
        </Modal>
      )}
    </div>
  );
}