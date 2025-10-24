

export interface CreateTaskDTO {
  title: string;
  description?: string;
}

export type TaskJobData =
  | { type: 'create'; body: CreateTaskDTO }
  | { type: 'update'; id: string; body: Partial<CreateTaskDTO> }
  | { type: 'delete'; id: string };
