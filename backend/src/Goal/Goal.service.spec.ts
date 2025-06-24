import { Test, TestingModule } from '@nestjs/testing';
import { GoalService } from './Goal.service';

describe('CatsService', () => {
  let service: GoalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoalService],
    }).compile();

    service = module.get<GoalService>(GoalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
