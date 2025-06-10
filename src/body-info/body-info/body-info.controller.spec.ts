import { Test, TestingModule } from '@nestjs/testing';
import { BodyInfoController } from './body-info.controller';

describe('BodyInfoController', () => {
  let controller: BodyInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BodyInfoController],
    }).compile();

    controller = module.get<BodyInfoController>(BodyInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
