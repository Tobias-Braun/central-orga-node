import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TodoListService } from './todo-list/todo-list.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly todoListService: TodoListService) { }

  @Get()
  async getHello(): Promise<string> {
    console.log("test");
    await this.todoListService.getCurrentDayTodoList();
    return "started";
  }
}
