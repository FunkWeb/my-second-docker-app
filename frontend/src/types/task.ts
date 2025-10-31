
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: number;

  title: string;

  description: string | null;

  status: TaskStatus;

  due_at: string | null;

  completed_at: string | null;

  created_at: string;

  updated_at: string;
}

export type NewTask = Omit<Task, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

export type UpdateTask = Partial<Omit<NewTask, 'status'>> & {
    status?: TaskStatus;
    completed_at?: string | null;
};
