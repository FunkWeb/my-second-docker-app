
import type { Job } from 'bullmq';
import { Task, TaskJobPayload, TaskCreateDTO, TaskJobUpdatePayload, TaskUpdateDTO, QueueJobPayload } from '../types/task.type.js';
import { postgres } from '../postgres.js';
import { PoolClient } from 'pg';


export default async function taskJob(job: Job<TaskJobPayload>) {
    const { operation, create, update, delete: deletePayload } = job.data;

    let client: PoolClient | undefined;

    try {
        client = await postgres.connect();

        switch (operation) {
            case 'CREATE':
                if (!create) throw new Error('CREATE data missing.');
                await handleCreateTask(client, create);
                return `[SUCCESS] Task created: ${create.title}`;

            case 'UPDATE':
                if (!update || !update.id) throw new Error('UPDATE data missing or Task ID missing.');
                await handleUpdateTask(client, update);
                return `[SUCCESS] Task ID ${update.id} updated.`;

            case 'DELETE':
                if (!deletePayload || !deletePayload.id) throw new Error('Task ID missing for DELETE operation.');
                await handleDeleteTask(client, deletePayload.id);
                return `[SUCCESS] Task ID ${deletePayload.id} deleted.`;

            default:
                throw new Error(`Unsupported operation: ${operation}`);
        }
    } catch (error) {

        console.error(`[WORKER ERROR] Failed to process job ${job.id} (Operation: ${operation}):`, error);
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
}

async function handleCreateTask(client: PoolClient, data: TaskCreateDTO) {
    const query = `
        INSERT INTO tasks (title, description, status, due_at)
        VALUES ($1, $2, $3, $4)
    `;

    const values = [
        data.title,
        data.description || null,
        'todo',
        data.due_at || null
    ];
    await client.query(query, values);
}

async function handleUpdateTask(client: PoolClient, updateData: TaskJobUpdatePayload) {
    const updates: string[] = [];
    const values: (string | number | null)[] = [updateData.id];
    let valueIndex = 2;

    if (updateData.title) {
        updates.push(`title = $${valueIndex++}`);
        values.push(updateData.title);
    }
    if (updateData.description !== undefined) {
        updates.push(`description = $${valueIndex++}`);
        values.push(updateData.description || null);
    }
    if (updateData.status) {
        updates.push(`status = $${valueIndex++}`);
        values.push(updateData.status);
    }
    if (updateData.due_at !== undefined) {
        updates.push(`due_at = $${valueIndex++}`);
        values.push(updateData.due_at || null);
    }

    updates.push(`updated_at = NOW()`);


    if (updates.length <= 1) {
        console.log(`[WARNING] Task ID ${updateData.id}: No fields to update. Skipping database query.`);
        return;
    }

    const query = `
        UPDATE tasks
        SET ${updates.join(', ')}
        WHERE id = $1
    `;

    await client.query(query, values);
}

async function handleDeleteTask(client: PoolClient, taskId: number) {
    const query = 'DELETE FROM tasks WHERE id = $1';
    await client.query(query, [taskId]);
}
