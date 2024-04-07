import { Injectable } from '@nestjs/common';
import EditorAsset from './editor-asset.entity';
import { Company } from 'src/company/company.entity';

const DEFAULT_MODELS = [
  {
    id: 0,
    assetPath: 'models/chair.glb',
    thumbnailPath: 'models/thumbnail-chair.png',
    isChair: true,
    isDefault: true,
  },
  {
    id: 0,
    assetPath: 'models/circle-desk.glb',
    thumbnailPath: 'models/thumbnail-circle-desk.png',
    isChair: false,
    isDefault: true,
  },
  {
    id: 0,
    assetPath: 'models/square-desk.glb',
    thumbnailPath: 'models/thumbnail-square-desk.png',
    isChair: false,
    isDefault: true,
  },
  {
    id: 0,
    assetPath: 'models/scaled-square-desk.glb',
    thumbnailPath: 'models/thumbnail-scaled-square-desk.png',
    isChair: false,
    isDefault: true,
  },
];

@Injectable()
export class EditorAssetService {
  async findAll(companyId: number): Promise<{
    editorAssets: {
      id: number;
      assetPath: string;
      thumbnailPath: string;
      isChair: boolean;
      isDefault: boolean;
    }[];
  }> {
    const queryBuilder = EditorAsset.createQueryBuilder()
      .select()
      .where({ company: { id: companyId } });

    const result = await queryBuilder.getMany();
    return {
      editorAssets: [
        ...DEFAULT_MODELS,
        ...result.map((value) => ({ ...value, isDefault: false })),
      ],
    };
  }

  async create(
    companyId: number,
    assetPath: string,
    thumbnailPath: string,
    isChair: boolean,
  ): Promise<EditorAsset> {
    const asset = new EditorAsset();
    asset.assetPath = assetPath;
    asset.thumbnailPath = thumbnailPath;
    asset.isChair = isChair;

    const company = await Company.findOne({ where: { id: companyId } });
    company.editorAssets.push(asset);
    await company.save();
    return asset;
  }

  async update(
    id: number,
    assetPath: string,
    thumbnailPath: string,
  ): Promise<EditorAsset> {
    const asset = await EditorAsset.findOne({ where: { id } });
    if (assetPath) {
      asset.assetPath = assetPath;
    }
    if (thumbnailPath) {
      asset.thumbnailPath = thumbnailPath;
    }

    return await asset.save();
  }

  async delete(id: number) {
    return await EditorAsset.delete(id);
  }
}
