export type Task = {
  id: number;
  title: string;
  description?: string;
  due_at: Date;
  status: 'todo' | 'in-progress' | 'done';
}