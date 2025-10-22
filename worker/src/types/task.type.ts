export interface CreateTaskDTO {
  title: string;
  description?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdAt: string;
}

export interface TaskJobData {
  type: 'create' | 'update' | 'delete';
  id?: string;
  body?: CreateTaskDTO;
}
