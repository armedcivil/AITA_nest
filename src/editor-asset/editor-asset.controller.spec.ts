import { Test, TestingModule } from '@nestjs/testing';
import { EditorAssetController } from './editor-asset.controller';

describe('EditorAssetController', () => {
  let controller: EditorAssetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EditorAssetController],
    }).compile();

    controller = module.get<EditorAssetController>(EditorAssetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
