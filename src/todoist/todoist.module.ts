import { Module } from '@nestjs/common';
import { TodoistService } from './todoist.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [TodoistService],
  exports: [TodoistService],
})
export class TodoistModule {}
