import { Test, TestingModule } from '@nestjs/testing';
import { DayEvaluationService } from './day-evaluation.service';

describe('DayEvaluationService', () => {
  let service: DayEvaluationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DayEvaluationService],
    }).compile();

    service = module.get<DayEvaluationService>(DayEvaluationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
