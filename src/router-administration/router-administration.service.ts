import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RouterAdministrationService {
  constructor(private readonly configService: ConfigService) {}
}
