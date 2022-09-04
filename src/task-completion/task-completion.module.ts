import { Module } from '@nestjs/common';
import { PiholeModule } from '../pihole/pihole.module';
import { TodoListModule } from '../todo-list/todo-list.module';
import { TaskCompletionService } from './task-completion.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [TodoListModule, PiholeModule, ConfigModule],
    providers: [TaskCompletionService],
    exports: [TaskCompletionService],
})
export class TaskCompletionModule { }
