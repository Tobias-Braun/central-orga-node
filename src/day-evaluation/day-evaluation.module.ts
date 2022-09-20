import { Module } from '@nestjs/common';
import { DayEvaluationService } from './day-evaluation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DayEvaluation } from './day-evaluation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DayEvaluation])],
  providers: [DayEvaluationService],
  exports: [DayEvaluationService],
})
export class DayEvaluationModule {}
