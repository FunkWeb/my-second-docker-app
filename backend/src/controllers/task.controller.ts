import { Controller, Post, Body, Get, Param, HttpError, Delete, Put } from 'routing-controllers';
import {tasksQueue} from "../queues/tasks.queue.js";
import {createtaskDTO, TaskResponseDTO, UpdateTaskDTO, TaskListItemDTO} from '../types/task.js';
import {TaskRepository} from "../repository/task.repository.js";

@Controller('/tasks')
export default class TaskController {
  private repo = new TaskRepository();

  @Post('/')
  async createTask(@Body() body: createtaskDTO): Promise<TaskResponseDTO> {
    const task = await this.repo.createTask(body);
    return task;
  }

  @Get('/')
  async getAllTasks(): Promise<TaskListItemDTO[]> {
    const tasks = await this.repo.getAll();
    return tasks;
  }

  @Get('/:id')
  async getTask(@Param('id') id: string): Promise<TaskResponseDTO> {
    const task = await this.repo.getbyId(id);
    if (!task) {
      throw new HttpError(404, 'Task not found');
    }
    return task;
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string): Promise<{ message: string }> {
 const deleted= await this.repo.delete(id);
 if (!deleted) {
      throw new HttpError(404, 'Task not found');
    }
    return { message: 'Task deleted successfully' };
  }

  @Put('/:id')
  async updateTask(
    @Param('id') id: string,
    @Body() body: UpdateTaskDTO
  ): Promise<TaskResponseDTO> {
    const task = await this.repo.update(id, body);

    if (!task) {
      throw new HttpError(404, 'Task not found');
    }



    return task;
  }
}
