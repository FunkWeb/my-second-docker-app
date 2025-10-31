import { tasksQueue } from '../queues/tasks.queue.js';
import { postgres } from '../postgres.js';
import { Task, TaskCreateDTO, TaskUpdateDTO, QueueJobPayload } from '../types/task.js';
import { PoolClient } from 'pg'; 

export class TaskRepository {

    
    public async findAll(): Promise<Task[]> {
        let client: PoolClient | undefined;
        try {
           
            client = await postgres.connect();
            const result = await client.query('SELECT * FROM tasks ORDER BY created_at DESC');
            
           
            return result.rows as Task[]; 

        } catch (error) {
            console.error("Error fetching tasks from DB:", error);
           
            throw new Error("Could not fetch tasks from database.");
        } finally {
            if (client) client.release();
        }
    }

   
    public async findById(id: number): Promise<Task | null> {
        let client: PoolClient | undefined;
        try {
            client = await postgres.connect();
            const result = await client.query('SELECT * FROM tasks WHERE id = $1', [id]);
            
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0] as Task;

        } catch (error) {
            console.error(`Error fetching task ${id} from DB:`, error);
            throw new Error("Could not fetch task by ID.");
        } finally {
            if (client) client.release();
        }
    }

    
    public async createJob(data: TaskCreateDTO): Promise<void> {
        const jobPayload: QueueJobPayload = { operation: 'CREATE', data: data };
        
        await tasksQueue.add('createTaskJob', jobPayload);
    }

    public async updateJob(id: number, data: TaskUpdateDTO): Promise<void> {
        const jobPayload: QueueJobPayload = { operation: 'UPDATE', taskId: id, data: data };
        await tasksQueue.add('updateTaskJob', jobPayload);
    }

   
    public async deleteJob(id: number): Promise<void> {
        const jobPayload: QueueJobPayload = { operation: 'DELETE', taskId: id, data: { id: id } };
        await tasksQueue.add('deleteTaskJob', jobPayload);
    }
}
