
export const TASK_STATUS_OPEN = 'open';
export const TASK_STATUS_DONE = 'done';

export interface Task {
    id: number;
    title: string;
    description: string;
    status: 'open' | 'done';

    created_at: string;
    updated_at: string;

    due_at: string | null;
    completed_at: string | null;
}

export interface TaskCreateDTO {
    title: string;
    description: string;

    due_at: string | null;
}

export interface TaskUpdateDTO {
    title?: string;
    description?: string;
    status?: 'open' | 'done';
    due_at?: string | null;
}
