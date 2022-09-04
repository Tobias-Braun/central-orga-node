import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TodoistService } from './todoist/todoist.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly todoListService: TodoistService) { }

  @Get()
  async getHello(): Promise<string> {
    console.log("test");
    await this.todoListService.getCurrentDayTodoList();
    return "started";
  }
}
