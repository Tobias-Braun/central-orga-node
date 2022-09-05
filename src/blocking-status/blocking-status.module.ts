import { Module } from '@nestjs/common';
import { BlockingStatusService } from './blocking-status.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockingStatus } from './blocking-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlockingStatus])],
  providers: [BlockingStatusService],
  exports: [BlockingStatusService],
})
export class BlockingStatusModule { }
