export interface CreateTaskDTO {
  title: string;
  description?: string;
}

export interface TaskJobData {
  type: 'create' | 'update' | 'delete';
  id?: string;
  body?: CreateTaskDTO;
}
