import { JsonController, Get, Post, Put, Delete, Param, Body, HttpCode } from 'routing-controllers';
import { TaskCreateDTO, TaskUpdateDTO, QueueJobPayload } from '../types/task.js';
import { fetchAllTasks, fetchTaskById } from '../postgres.js';
import { addTaskJob } from '../queues/tasks.queue.js';


@JsonController()
export class TaskController {


    @Get('/tasks')
    public async getTasks() {

        return fetchAllTasks();
    }


    @Get('/task/:id')
    public async getTaskById(@Param('id') id: number) {
        if (isNaN(id)) {

            throw { httpCode: 400, message: 'Invalid task ID format.' };
        }

        const task = await fetchTaskById(id);

        if (!task) {
            throw { httpCode: 404, message: `Task with ID ${id} not found.` };
        }
        return task;
    }


    @Post('/task')
    @HttpCode(202)
    public async createTask(@Body() data: TaskCreateDTO) {
        if (!data.title || data.title.length === 0 || data.title.length > 200) {
            throw { httpCode: 400, message: 'Title is required and must be between 1 and 200 characters.' };
        }

        const jobPayload: QueueJobPayload = { operation: 'CREATE', data: data };
        await addTaskJob(jobPayload);

        return {
            message: 'Task creation request accepted and queued for processing.',
            job: { operation: jobPayload.operation },
        };
    }

    @Put('/task/:id')
    @HttpCode(202)
    public async updateTask(@Param('id') id: number, @Body() data: TaskUpdateDTO) {
        if (isNaN(id)) {
            throw { httpCode: 400, message: 'Invalid task ID format.' };
        }
        if (Object.keys(data).length === 0) {
             throw { httpCode: 400, message: 'No update data provided in the request body.' };
        }

        const jobPayload: QueueJobPayload = { operation: 'UPDATE', taskId: id, data: data };
        await addTaskJob(jobPayload);

        return {
            message: `Task ID ${id} update request accepted and queued for processing.`,
            job: { operation: jobPayload.operation, taskId: jobPayload.taskId },
        };
    }
    @Delete('/task/:id')
    @HttpCode(202)
    public async deleteTask(@Param('id') id: number) {
        if (isNaN(id)) {
            throw { httpCode: 400, message: 'Invalid task ID format.' };
        }

        const jobPayload: QueueJobPayload = { operation: 'DELETE', taskId: id, data: { id: id } };
        await addTaskJob(jobPayload);

        return {
            message: `Task ID ${id} deletion request accepted and queued for processing.`,
            job: { operation: jobPayload.operation, taskId: jobPayload.taskId },
        };
    }
}
