import type { Job } from 'bullmq';
import { Task, QueueJobPayload, TaskCreateDTO, TaskUpdateDTO } from '../types/task.type.js';
import { postgres } from '../postgres.js';
import { PoolClient } from 'pg';


export default async function taskJob(job: Job<QueueJobPayload>) {
    const { operation, taskId, data } = job.data;
    let client: PoolClient | undefined;

    try {
        client = await postgres.connect();

        switch (operation) {
            case 'CREATE':

                const createData = data as TaskCreateDTO;
                await handleCreateTask(client, createData);
                return `[SUCCESS] Task created: ${createData.title}`;

            case 'UPDATE':
                if (!taskId) {
                    throw new Error('Task ID missing for UPDATE operation.');
                }

                const updateData = data as TaskUpdateDTO;
                await handleUpdateTask(client, taskId, updateData);
                return `[SUCCESS] Task ID ${taskId} updated.`;

            case 'DELETE':
                if (!taskId) {
                    throw new Error('Task ID missing for DELETE operation.');
                }
                await handleDeleteTask(client, taskId);
                return `[SUCCESS] Task ID ${taskId} deleted.`;

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
        data.due_at || null
    ];
    await client.query(query, values);
}

async function handleUpdateTask(client: PoolClient, taskId: number, updateData: TaskUpdateDTO) {
    const updates: string[] = [];
    const values: (string | number | null)[] = [taskId];
    let valueIndex = 2;

    if (updateData.title) {
        updates.push(`title = $${valueIndex++}`);
        values.push(updateData.title);
    }
    if (updateData.description) {
        updates.push(`description = $${valueIndex++}`);
        values.push(updateData.description);
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


    if (updates.length === 0) {
        console.log(`[WARNING] Task ID ${taskId}: No fields to update. Skipping database query.`);
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
