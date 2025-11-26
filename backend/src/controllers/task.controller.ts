import {Body, Delete, Get, JsonController, Param, Post, Put} from 'routing-controllers';
import {tasksQueue} from "../queues/tasks.queue.js";
import {TaskRepository} from "../repositories/task.repository.js";
import {TaskCreateDTO, TaskID, TaskUpdateDTO} from "../types/task.js";

@JsonController('/task')
export class TaskController {
  @Get('/:id')
  async get(@Param('id') id: TaskID) {
    const numericId = Number(id as unknown as string);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new Error('Invalid ID');
    }

    return TaskRepository.findById(numericId as TaskID)
  }

  @Post('/')
  async post(@Body() task: TaskCreateDTO) {
    void tasksQueue.add('createTask', task);

    return null
  }

  @Put('/:id')
  async put(@Param('id') id: TaskID, @Body() task: TaskUpdateDTO) {
    const numericId = Number(id as unknown as string);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new Error('Invalid ID');
    }

    void tasksQueue.add('updateTask', {id: numericId, ...task});

    return null
  }

  @Delete('/:id')
  async delete(@Param('id') id: TaskID) {
    const numericId = Number(id as unknown as string);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new Error('Invalid ID');
    }

    void tasksQueue.add('deleteTask', {id: numericId});

    return null
  }
}
