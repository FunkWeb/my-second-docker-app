export type Task = {
  id: number;
  text: string;
  description: string;
  due_at: string;
  status: 'todo' | 'in-progress' | 'done';
  completed: boolean;
}