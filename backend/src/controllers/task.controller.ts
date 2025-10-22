import { Controller, Post, Body, Put, Delete, Param, Get } from 'routing-controllers';
import { tasksQueue } from '../queues/tasks.queue.js';
import { CreateTaskDTO, TaskJobData } from '../types/task.js';
import { postgres } from "../postgres.js";

@Controller('/tasks')
export default class TaskController {

  @Post('/')
  async createTask(@Body() body: CreateTaskDTO) {
    const jobData: TaskJobData = { type: 'create', body }; // <-- type included
    await tasksQueue.add('create-task', jobData);
    return { message: 'Task creation has been queued' };
  }

  @Put('/:id')
  async updateTask(@Param('id') id: string, @Body() body: Partial<CreateTaskDTO>) {
    const jobData: TaskJobData = { type: 'update', id, body }; // <-- type included
    await tasksQueue.add('update-task', jobData);
    return { message: 'Task update has been queued' };
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string) {
    const jobData: TaskJobData = { type: 'delete', id }; // <-- type included
    await tasksQueue.add('delete-task', jobData);
    return { message: 'Task deletion has been queued' };
  }

  @Get('/')
  async getAllTasks() {
    const result = await postgres.query('SELECT * FROM tasks ORDER BY created_at DESC');
    return result.rows;
  }
}
