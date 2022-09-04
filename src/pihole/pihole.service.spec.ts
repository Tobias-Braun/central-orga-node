import { Test, TestingModule } from '@nestjs/testing';
import { PiholeService } from './pihole.service';

describe('PiholeService', () => {
  let service: PiholeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PiholeService],
    }).compile();

    service = module.get<PiholeService>(PiholeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
