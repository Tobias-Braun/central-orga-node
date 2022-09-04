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
import { TaskCompletionService } from './task-completion/task-completion.service';
import { TaskCompletionModule } from './task-completion/task-completion.module';
import { PiholeModule } from './pihole/pihole.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      load: [env],
    }), TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get(ENV_VARIABLES.database),
      inject: [ConfigService],
    }), TodoListModule, TaskCompletionModule, PiholeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
