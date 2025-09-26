export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Todo' | 'InProgress' | 'Done';
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: Date;
}

export interface ProgressStats {
  total: number;
  completed: number;
  percentage: number;
}

export type ViewType = 'grid' | 'kanban';
export type FilterType = 'inbox' | 'today' | 'upcoming' | 'completed';
export type Priority = 'High' | 'Medium' | 'Low';
export type Status = 'Todo' | 'InProgress' | 'Done';