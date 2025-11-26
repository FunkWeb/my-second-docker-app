import {Get, JsonController} from "routing-controllers";
import {TaskRepository} from "../repositories/task.repository.js";

@JsonController('/tasks')
export class TasksController {
  @Get('/')
  async get() {
    return TaskRepository.findAll()
  }
}
