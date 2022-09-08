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
import { BlockingStatusModule } from './blocking-status/blocking-status.module';
import { RouterAdministrationModule } from './router-administration/router-administration.module';
import { SiteBlockModule } from './site-block/site-block.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      load: [env],
    }), TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get(ENV_VARIABLES.database),
      inject: [ConfigService],
    }), TodoListModule, TaskCompletionModule, PiholeModule, DayEvaluationModule, BlockingStatusModule, RouterAdministrationModule, SiteBlockModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
