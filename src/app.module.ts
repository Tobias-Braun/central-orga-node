import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoistService } from './todoist/todoist.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import env from './config/dev';
import { ENV_VARIABLES } from './env/env';
import { TodoListModule } from './todo-list/todo-list.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskCompletionModule } from './task-completion/task-completion.module';
import { PiholeModule } from './pihole/pihole.module';
import { DayEvaluationService } from './day-evaluation/day-evaluation.service';
import { DayEvaluationModule } from './day-evaluation/day-evaluation.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      load: [env],
    }), TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get(ENV_VARIABLES.database),
      inject: [ConfigService],
    }), TodoListModule, TaskCompletionModule, PiholeModule, DayEvaluationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
