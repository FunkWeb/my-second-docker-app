import { tasksQueue } from '../queues/tasks.queue.js';
import { postgres } from '../postgres.js';
import { Task, TaskCreateDTO, TaskUpdateDTO, TaskJobPayload, TaskJobUpdatePayload } from '../types/task.js';
import { PoolClient } from 'pg';

export class TaskRepository {

    public static async findAll(): Promise<Task[]> {
        let client: PoolClient | undefined;
        try {
            client = await postgres.connect();
            const result = await client.query('SELECT * FROM tasks ORDER BY created_at DESC');
            return result.rows as Task[];
        } catch (error) {
            console.error("Database Error (findAll):", error);
            throw new Error("Could not fetch tasks from database.");
        } finally {
            if (client) client.release();
        }
    }


    public static async findById(id: number): Promise<Task | null> {
        let client: PoolClient | undefined;
        try {
            client = await postgres.connect();
            const result = await client.query('SELECT * FROM tasks WHERE id = $1', [id]);

            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0] as Task;
        } catch (error) {
            console.error(`Database Error (findById ${id}):`, error);
            throw new Error("Could not fetch task by ID.");
        } finally {
            if (client) client.release();
        }
    }

    public static async createJob(data: TaskCreateDTO): Promise<void> {
        const jobPayload: TaskJobPayload = { operation: 'CREATE', create: data };
        await tasksQueue.add('createTaskJob', jobPayload);
    }

    public static async updateJob(id: number, data: TaskUpdateDTO): Promise<void> {
        const updateData: TaskJobUpdatePayload = { id: id, ...data };
        const jobPayload: TaskJobPayload = { operation: 'UPDATE', update: updateData };
        await tasksQueue.add('updateTaskJob', jobPayload);
    }


    public static async deleteJob(id: number): Promise<void> {
        const jobPayload: TaskJobPayload = { operation: 'DELETE', delete: { id: id } };
        await tasksQueue.add('deleteTaskJob', jobPayload);
    }
}
