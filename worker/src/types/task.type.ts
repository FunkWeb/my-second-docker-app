export type Task = {
  id?: number;
  title: string;
  description?: string;
  completed?: boolean;
};

export type TaskAction = {
  action: 'create' | 'update' | 'delete';
  data: Task;
};
