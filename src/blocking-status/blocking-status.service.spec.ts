import { Test, TestingModule } from '@nestjs/testing';
import { BlockingStatusService } from './blocking-status.service';

describe('BlockingStatusService', () => {
  let service: BlockingStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockingStatusService],
    }).compile();

    service = module.get<BlockingStatusService>(BlockingStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
