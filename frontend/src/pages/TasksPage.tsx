import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskFiltersBar } from '../components/tasks/TaskFilters';
import { Modal } from '../components/common/Modal';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import type { Task, TaskFilters as TaskFiltersType } from '../types/models';

export function TasksPage() {
  const [filters, setFilters] = useState<TaskFiltersType>({ sortBy: 'createdAt', order: 'desc' });
  const { tasks, isLoading, error, refetch, updateTask, deleteTask } = useTasks(filters);
  const { projects } = useProjects();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const projectNameById = new Map(projects.map((p) => [p.id, p.name]));

  async function handleDelete(task: Task) {
    if (!confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
    await deleteTask(task.id);
  }

  return (
    <div>
      <div className="page-header">
        <h1>All tasks</h1>
      </div>

      <TaskFiltersBar filters={filters} onChange={setFilters} />

      {isLoading && <LoadingState label="Loading tasks..." />}
      {!isLoading && error && <ErrorState message={error} onRetry={refetch} />}
      {!isLoading && !error && tasks.length === 0 && (
        <EmptyState title="No tasks match these filters" description="Try clearing a filter, or add tasks from a project." />
      )}

      {!isLoading && !error && tasks.length > 0 && (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              projectName={projectNameById.get(task.projectId)}
              onStatusChange={(status) => updateTask(task.id, { status })}
              onEdit={() => setEditingTask(task)}
              onDelete={() => handleDelete(task)}
            />
          ))}
        </div>
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