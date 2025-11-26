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

export type TaskJobUpdatePayload = {
    id: number;
    title?: string;
    description?: string | null;
    status?: string;
    due_at?: string | null;
};

export type TaskJobPayload = {
    operation: 'CREATE' | 'UPDATE' | 'DELETE';
    create?: TaskCreateDTO;
    update?: TaskJobUpdatePayload;
    delete?: { id: number };
};

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
