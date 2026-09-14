export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export type ProjectStatus = 'ACTIVE' | 'ARCHIVED';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
  description: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  projectId: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  sortBy?: 'dueDate' | 'createdAt' | 'priority' | 'title';
  order?: 'asc' | 'desc';
}

export interface DashboardStats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
}