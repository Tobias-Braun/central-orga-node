import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TodoistService } from './todoist/todoist.service';
import { TodoListService } from './todo-list/todo-list.service';
import { PiholeService } from './pihole/pihole.service';

@Controller()
export class AppController {
  constructor(private readonly piholeService: PiholeService, private readonly todoListService: TodoListService) { }

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

  @Get("/pihole")
  async getPiHole(): Promise<string> {
    await this.piholeService.activateBlockList();
    return "block list activated";
  }
}
