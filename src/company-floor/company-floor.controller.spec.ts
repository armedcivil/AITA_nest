import { Test, TestingModule } from '@nestjs/testing';
import { CompanyFloorController } from './company-floor.controller';

describe('CompanyFloorController', () => {
  let controller: CompanyFloorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyFloorController],
    }).compile();

    controller = module.get<CompanyFloorController>(CompanyFloorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
