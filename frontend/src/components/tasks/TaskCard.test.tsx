import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from './TaskCard';
import type { Task } from '../../types/models';

function buildTask(overrides: Partial<Task> = {}): Task {
  return {
    id: '1', title: 'Write tests', description: 'Cover critical paths',
    status: 'TODO', priority: 'MEDIUM', dueDate: null, projectId: 'p1',
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('TaskCard', () => {
  it('shows an overdue label when the due date is past and the task is not done', () => {
    const task = buildTask({ dueDate: '2020-01-01T00:00:00.000Z', status: 'TODO' });
    render(<TaskCard task={task} onStatusChange={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/overdue/i)).toBeInTheDocument();
  });

  it('does not show an overdue label when the task is already done', () => {
    const task = buildTask({ dueDate: '2020-01-01T00:00:00.000Z', status: 'DONE' });
    render(<TaskCard task={task} onStatusChange={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.queryByText(/overdue/i)).not.toBeInTheDocument();
  });

  it('calls onStatusChange with the new value when the status dropdown changes', () => {
    const task = buildTask();
    const handleStatusChange = vi.fn();
    render(<TaskCard task={task} onStatusChange={handleStatusChange} onEdit={vi.fn()} onDelete={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(`Change status for ${task.title}`), { target: { value: 'DONE' } });
    expect(handleStatusChange).toHaveBeenCalledWith('DONE');
  });
});