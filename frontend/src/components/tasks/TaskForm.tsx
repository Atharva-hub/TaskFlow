import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../common/Button';
import type { Task, TaskStatus, TaskPriority } from '../../types/models';

interface TaskFormProps {
  initialValues?: Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'dueDate'>;
  onSubmit: (values: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string | null;
  }) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function TaskForm({ initialValues, onSubmit, onCancel, submitLabel = 'Save' }: TaskFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(initialValues?.status ?? 'TODO');
  const [priority, setPriority] = useState<TaskPriority>(initialValues?.priority ?? 'MEDIUM');
  const [dueDate, setDueDate] = useState(initialValues?.dueDate ? initialValues.dueDate.slice(0, 10) : '');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="entity-form">
      {error && <div className="auth-error" role="alert">{error}</div>}

      <label htmlFor="task-title">Title</label>
      <input id="task-title" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} />

      <label htmlFor="task-description">Description</label>
      <textarea id="task-description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} />

      <div className="form-row">
        <div>
          <label htmlFor="task-status">Status</label>
          <select id="task-status" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
            <option value="TODO">To do</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
        <div>
          <label htmlFor="task-priority">Priority</label>
          <select id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>

      <label htmlFor="task-due-date">Due date (optional)</label>
      <input id="task-due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : submitLabel}</Button>
      </div>
    </form>
  );
}