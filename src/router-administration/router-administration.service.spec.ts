import { Test, TestingModule } from '@nestjs/testing';
import { RouterAdministrationService } from './router-administration.service';

describe('RouterAdministrationService', () => {
  let service: RouterAdministrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RouterAdministrationService],
    }).compile();

    service = module.get<RouterAdministrationService>(
      RouterAdministrationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
