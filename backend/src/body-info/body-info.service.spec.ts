import { Test, TestingModule } from '@nestjs/testing';
import { BodyInfoService } from './body-info.service';

describe('BodyInfoService', () => {
  let service: BodyInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BodyInfoService],
    }).compile();

    service = module.get<BodyInfoService>(BodyInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
