import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterAdministrationService } from './router-administration.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [RouterAdministrationService],
  exports: [RouterAdministrationService],
})
export class RouterAdministrationModule {}
