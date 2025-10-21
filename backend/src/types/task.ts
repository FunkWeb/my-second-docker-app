export type Task = {
    id: bigint;
    title: string;
    description?: string;
    status: 'pending' | 'in-progress' | 'completed';

    due_at?: Date;
    completed_at?: Date;
    created_at: Date;
    updated_at: Date;
}
