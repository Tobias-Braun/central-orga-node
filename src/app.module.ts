import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoistService } from './todoist/todoist.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import env from './config/dev';
import { ENV_VARIABLES } from './env/env';

@Module({
  imports: [ConfigModule.forRoot({
    load: [env],
  }), TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (config: ConfigService) => config.get(ENV_VARIABLES.database),
    inject: [ConfigService],
  })],
  controllers: [AppController],
  providers: [AppService, TodoistService],
})
export class AppModule { }
