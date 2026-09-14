import type { Task } from '../../types/models';
import { Button } from '../common/Button';

const priorityLabels: Record<Task['priority'], string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

interface TaskCardProps {
  task: Task;
  projectName?: string;
  onStatusChange: (status: Task['status']) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskCard({ task, projectName, onStatusChange, onEdit, onDelete }: TaskCardProps) {
  const isOverdue = !!task.dueDate && task.status !== 'DONE' && new Date(task.dueDate) < new Date();

  return (
    <div className="task-card">
      <div className="task-card-main">
        <div className="task-card-title-row">
          <h4>{task.title}</h4>
          <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
            {priorityLabels[task.priority]}
          </span>
        </div>
        <p className="task-card-desc">{task.description}</p>
        <div className="task-card-meta">
          {projectName && <span>{projectName}</span>}
          {task.dueDate && (
            <span className={isOverdue ? 'task-overdue' : ''}>
              Due {new Date(task.dueDate).toLocaleDateString()}{isOverdue ? ' (overdue)' : ''}
            </span>
          )}
        </div>
      </div>
      <div className="task-card-actions">
        <select
          aria-label={`Change status for ${task.title}`}
          value={task.status}
          onChange={(e) => onStatusChange(e.target.value as Task['status'])}
        >
          <option value="TODO">To do</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="DONE">Done</option>
        </select>
        <Button variant="secondary" onClick={onEdit}>Edit</Button>
        <Button variant="danger" onClick={onDelete}>Delete</Button>
      </div>
    </div>
  );
}