import type { TaskFilters as TaskFiltersType } from '../../types/models';

interface TaskFiltersBarProps {
  filters: TaskFiltersType;
  onChange: (filters: TaskFiltersType) => void;
}

export function TaskFiltersBar({ filters, onChange }: TaskFiltersBarProps) {
  return (
    <div className="task-filters">
      <div>
        <label htmlFor="filter-status">Status</label>
        <select
          id="filter-status"
          value={filters.status ?? ''}
          onChange={(e) => onChange({ ...filters, status: (e.target.value || undefined) as TaskFiltersType['status'] })}
        >
          <option value="">All</option>
          <option value="TODO">To do</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>
      <div>
        <label htmlFor="filter-priority">Priority</label>
        <select
          id="filter-priority"
          value={filters.priority ?? ''}
          onChange={(e) => onChange({ ...filters, priority: (e.target.value || undefined) as TaskFiltersType['priority'] })}
        >
          <option value="">All</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>
      <div>
        <label htmlFor="filter-sort">Sort by</label>
        <select
          id="filter-sort"
          value={filters.sortBy ?? 'createdAt'}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value as TaskFiltersType['sortBy'] })}
        >
          <option value="createdAt">Newest</option>
          <option value="dueDate">Due date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>
      <div>
        <label htmlFor="filter-order">Order</label>
        <select
          id="filter-order"
          value={filters.order ?? 'asc'}
          onChange={(e) => onChange({ ...filters, order: e.target.value as TaskFiltersType['order'] })}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
}