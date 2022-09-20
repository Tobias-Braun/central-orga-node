import { Module } from '@nestjs/common';
import { SiteBlockService } from './site-block.service';

@Module({
  providers: [SiteBlockService],
})
export class SiteBlockModule {}
