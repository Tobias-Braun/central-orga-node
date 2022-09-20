import { Module } from '@nestjs/common';
import { TodoListService } from './todo-list.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoList, TodoListItem } from './todo-list.entity';
import { TodoistModule } from '../todoist/todoist.module';

@Module({
  imports: [TypeOrmModule.forFeature([TodoList, TodoListItem]), TodoistModule],
  providers: [TodoListService],
  exports: [TodoListService],
})
export class TodoListModule {}
