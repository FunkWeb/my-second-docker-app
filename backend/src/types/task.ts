// backend/src/types/task.ts

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done';
  due_at: Date | null;
  completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done';
  due_at?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done';
  due_at?: string;
  completed_at?: string;
}

export interface TaskResponse {
  success: boolean;
  message: string;
  data?: Task | Task[];
}
