export interface Task {
    id: number;
    title: string;
    description?: string | null;
    status: 'todo' | 'in_progress' | 'done';
    due_at?: Date | null;
    completed_at?: Date | null;
    created_at: Date;
    updated_at: Date;
}

// Data for å opprette en ny task
export interface TaskCreateDTO {
    title: string;
    description?: string;
    due_at?: string;
}

// Data for å oppdatere en Task
export interface TaskUpdateDTO {
    title?: string;
    description?: string | null;
    status?: 'todo' | 'in_progress' | 'done';
    due_at?: string | null;
}

// Payload som sendes til worker-køen
export interface QueueJobPayload {
    operation: 'CREATE' | 'UPDATE' | 'DELETE';
    data: TaskCreateDTO | TaskUpdateDTO | { id: number };
    taskId?: number;
}

