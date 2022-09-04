import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoistService } from './todoist/todoist.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import env from './config/dev';

@Module({
  imports: [ConfigModule.forRoot({
    load: [env],
  }), TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'root',
    password: 'root',
    database: 'central_orga_node',
    entities: [],
    synchronize: true,
  })],
  controllers: [AppController],
  providers: [AppService, TodoistService],
})
export class AppModule { }
