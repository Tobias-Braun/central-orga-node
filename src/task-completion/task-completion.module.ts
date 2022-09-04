import { Module } from '@nestjs/common';
import { TodoListModule } from '../todo-list/todo-list.module';
import { TaskCompletionService } from './task-completion.service';

@Module({
    imports: [TodoListModule],
    providers: [TaskCompletionService],
    exports: [TaskCompletionService],
})
export class TaskCompletionModule { }
