import { Module } from '@nestjs/common';
import { PiholeModule } from '../pihole/pihole.module';
import { TodoListModule } from '../todo-list/todo-list.module';
import { TaskCompletionService } from './task-completion.service';
import { ConfigModule } from '@nestjs/config';
import { DayEvaluationModule } from '../day-evaluation/day-evaluation.module';
import { BlockingStatusModule } from '../blocking-status/blocking-status.module';

@Module({
  imports: [
    TodoListModule,
    PiholeModule,
    ConfigModule,
    DayEvaluationModule,
    BlockingStatusModule,
  ],
  providers: [TaskCompletionService],
  exports: [TaskCompletionService],
})
export class TaskCompletionModule {}
