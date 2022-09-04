import { Test, TestingModule } from '@nestjs/testing';
import { TaskCompletionService } from './task-completion.service';

describe('TaskCompletionService', () => {
  let service: TaskCompletionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskCompletionService],
    }).compile();

    service = module.get<TaskCompletionService>(TaskCompletionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
