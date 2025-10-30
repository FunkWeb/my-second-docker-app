export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  created_at: string;
}

export interface CreateTaskDto {
  title: string;
  due_at: Date;
  description?: string;
}

export interface UpdateTaskDto {
  title?: string;
  due_at?: Date;
  description?: string;
  status?: 'todo' | 'in-progress' | 'done';
}

export interface TasksContextValue {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (task: CreateTaskDto) => Promise<void>;
  updateTask: (id: number, updates: UpdateTaskDto) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}