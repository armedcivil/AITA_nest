import { Injectable } from '@nestjs/common';
import EditorAsset from './editor-asset.entity';
import { Company } from 'src/company/company.entity';

const COUNT_PER_PAGE = 10;

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
  async findAll(
    companyId: number,
    page?: string,
    order?: string,
  ): Promise<{
    editorAssets: {
      id: number;
      assetPath: string;
      thumbnailPath: string;
      isChair: boolean;
      isDefault: boolean;
    }[];
    pager?: {
      total: number;
      maxPage: number;
      hasPrevious: boolean;
      hasNext: boolean;
      current: number;
    };
  }> {
    const queryBuilder = EditorAsset.createQueryBuilder()
      .select()
      .where({ company: { id: companyId } });

    const result = await queryBuilder.getMany();
    const allAssets = [
      ...DEFAULT_MODELS,
      ...result.map((value) => ({ ...value, isDefault: false })),
    ];
    let data = allAssets;
    if (order) {
      data.sort((a, b) => {
        switch (order) {
          case 'asc':
            return a.id - b.id;
          case 'desc':
            return b.id - a.id;
          default:
            return 0;
        }
      });
    }
    let pager = undefined;
    if (!Number.isNaN(Number(page))) {
      const start = Math.max(Number(page) - 1, 0) * COUNT_PER_PAGE;
      const end = start + COUNT_PER_PAGE;
      const maxPage = this.getMaxPage(data.length, COUNT_PER_PAGE);

      data = data.slice(start, end);
      pager = {
        total: allAssets.length,
        maxPage,
        hasPrevious: Number(page) > 1,
        hasNext: Number(page) < maxPage,
        current: Number(page),
      };
    }
    return {
      editorAssets: data,
      pager,
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
    asset.company = company;
    return asset.save();
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

  private getMaxPage(total: number, perPage: number) {
    return total % perPage > 0
      ? Math.floor(total / perPage) + 1
      : Math.floor(total / perPage);
  }
}
