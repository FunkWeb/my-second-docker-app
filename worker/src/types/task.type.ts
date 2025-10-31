export interface Task {
    id: number;
    title: string;
    description: string;
    status: 'todo' | 'in_progress' | 'done';
    created_at: Date;
    due_at?: Date;
}

export interface TaskCreateDTO {
    title: string;
    description: string;
    due_at?: string;
}

export interface TaskUpdateDTO {
    title?: string;
    description?: string;
    status?: 'todo' | 'in_progress' | 'done';
    due_at?: string;
}

export interface QueueJobPayload {
    operation: 'CREATE' | 'UPDATE' | 'DELETE';
    taskId?: number;
    data: TaskCreateDTO | TaskUpdateDTO | { id: number };
}
