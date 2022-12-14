import { Controller, Get } from '@nestjs/common';
import { TodoListService } from './todo-list/todo-list.service';
import { PiholeService } from './pihole/pihole.service';

@Controller()
export class AppController {
  constructor(
    private readonly piholeService: PiholeService,
    private readonly todoListService: TodoListService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    return 'hello';
  }
}
