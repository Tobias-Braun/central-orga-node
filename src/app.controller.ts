import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TodoistService } from './todoist/todoist.service';
import { TodoListService } from './todo-list/todo-list.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly todoListService: TodoListService) { }

  @Get()
  async getHello(): Promise<string> {
    let todoList = await this.todoListService.findForToday();
    return JSON.stringify(todoList);
  }

  @Get("/update")
  async getUpdate(): Promise<string> {
    let difference = await this.todoListService.getDifferenceForToday();
    return `tasks not done: ${difference}`;
  }
}
