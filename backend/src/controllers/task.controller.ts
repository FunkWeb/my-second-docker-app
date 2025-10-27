import { JsonController, Get, Post, Put, Delete, Param, Body, HttpCode } from 'routing-controllers';
import { TaskCreateDTO, TaskUpdateDTO } from '../types/task.js';
import { TaskRepository } from '../repositories/task.repository.js';

const taskRepository = new TaskRepository();

@JsonController()
export class TaskController {

    @Get('/tasks')
    public async getTasks() {
        return taskRepository.findAll();
    }

    @Get('/task/:id')
    public async getTaskById(@Param('id') id: number) {
        if (isNaN(id)) {
            throw { httpCode: 400, message: 'Invalid task ID format.' };
        }

        const task = await taskRepository.findById(id);

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

        await taskRepository.createJob(data);

        return {
            message: 'Task creation request accepted and queued for processing.',
            job: { operation: 'CREATE' },
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

        await taskRepository.updateJob(id, data);

        return {
            message: `Task ID ${id} update request accepted and queued for processing.`,
            job: { operation: 'UPDATE', taskId: id },
        };
    }


    @Delete('/task/:id')
    @HttpCode(202)
    public async deleteTask(@Param('id') id: number) {
        if (isNaN(id)) {
            throw { httpCode: 400, message: 'Invalid task ID format.' };
        }

        await taskRepository.deleteJob(id);

        return {
            message: `Task ID ${id} deletion request accepted and queued for processing.`,
            job: { operation: 'DELETE', taskId: id },
        };
    }
}
