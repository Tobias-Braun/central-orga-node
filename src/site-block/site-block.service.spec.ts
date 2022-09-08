import { Test, TestingModule } from '@nestjs/testing';
import { SiteBlockService } from './site-block.service';

describe('SiteBlockService', () => {
  let service: SiteBlockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SiteBlockService],
    }).compile();

    service = module.get<SiteBlockService>(SiteBlockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
