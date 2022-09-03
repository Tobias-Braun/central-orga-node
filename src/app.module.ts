import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoListService } from './todo-list/todo-list.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, TodoListService],
})
export class AppModule {}
