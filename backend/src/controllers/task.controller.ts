import { Controller, Post, Body, Get, Param, HttpError } from 'routing-controllers';
import { Task } from '../types/task.js';
import crypto from 'crypto';
import {tasksQueue} from "../queues/tasks.queue.js";

@Controller('/tasks')
export default class TaskController {
  @Post('/')
  async createTask(@Body() body: { title: string; description: string }) {
    const task: Task = {
      id: crypto.randomUUID(),
      title: body.title,
      description: body.description,
      status: 'queued',
      createdAt: new Date().toISOString(),
    };

    await tasksQueue.add('process-task', task, {
      removeOnComplete: false,
      removeOnFail: false,
    });

    return task;
  }

  @Get('/:id')
  async getTask(@Param('id') id: string) {
    const job = await tasksQueue.getJob(id);
    if (!job) throw new HttpError(404, 'Not found');
    return job.data as Task;
  }
}
