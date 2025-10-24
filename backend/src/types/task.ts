// Standard task interface
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
export interface TaskCreateRequest {
    title: string;
    description?: string;
    due_at?: string; // Dato/tid som streng
}

// Data for å oppdatere en Task
export interface TaskUpdateRequest {
    title?: string;
    description?: string | null;
    status?: 'todo' | 'in_progress' | 'done';
    due_at?: string | null;
}

// Payload som sendes til worker-køen
export interface QueueJobPayload {
    operation: 'CREATE' | 'UPDATE' | 'DELETE';
    data: TaskCreateRequest | TaskUpdateRequest | { id: number }; // Dataen som Worker trenger
    taskId?: number; // Brukes for UPDATE og DELETE
}

