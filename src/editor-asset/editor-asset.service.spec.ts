import { Test, TestingModule } from '@nestjs/testing';
import { EditorAssetService } from './editor-asset.service';

describe('EditorAssetService', () => {
  let service: EditorAssetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EditorAssetService],
    }).compile();

    service = module.get<EditorAssetService>(EditorAssetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
