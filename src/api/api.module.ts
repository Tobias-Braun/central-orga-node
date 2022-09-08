import { Module } from '@nestjs/common';
import { DayEvaluationModule } from '../day-evaluation/day-evaluation.module';
import { BlockingStatusModule } from '../blocking-status/blocking-status.module';
import { TodoListModule } from '../todo-list/todo-list.module';
import { ApiController } from './api.controller';

@Module({
  imports: [DayEvaluationModule, BlockingStatusModule, TodoListModule],
  controllers: [ApiController]
})
export class ApiModule {}
