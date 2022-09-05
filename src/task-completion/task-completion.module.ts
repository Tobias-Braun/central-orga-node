import { Module } from '@nestjs/common';
import { PiholeModule } from '../pihole/pihole.module';
import { TodoListModule } from '../todo-list/todo-list.module';
import { TaskCompletionService } from './task-completion.service';
import { ConfigModule } from '@nestjs/config';
import { DayEvaluation } from '../day-evaluation/day-evaluation.entity';
import { DayEvaluationModule } from '../day-evaluation/day-evaluation.module';

@Module({
    imports: [TodoListModule, PiholeModule, ConfigModule, DayEvaluationModule],
    providers: [TaskCompletionService],
    exports: [TaskCompletionService],
})
export class TaskCompletionModule { }
