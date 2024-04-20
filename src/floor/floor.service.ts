import { Injectable } from '@nestjs/common';
import { FloorDto } from './floor.dto';
import { Floor } from './floor.entity';
import { randomBytes } from 'crypto';
import { User } from 'src/user/user.entity';
import { EditorAssetService } from 'src/editor-asset/editor-asset.service';

@Injectable()
export class FloorService {
  constructor(private editorAssetService: EditorAssetService) {}

  async find(
    companyId?: number,
    userId?: number,
    viewerKey?: string,
  ): Promise<FloorDto> {
    if (!companyId && userId) {
      const user = await User.findOne({
        where: { id: userId },
        relations: { company: true },
      });
      companyId = user.company.id;
    }

    const queryBuilder = Floor.createQueryBuilder().select();
    let query = queryBuilder;
    if (companyId) {
      query = queryBuilder.where('company_id = :companyId', { companyId });
    } else if (viewerKey) {
      query = queryBuilder.where('viewer_key = :viewerKey', { viewerKey });
    }

    const result = await query.getOne();

    if (result) {
      const response = JSON.parse(result.floor);
      response.floors = await Promise.all(
        response.floors.map(async (floor) => {
          const objects = await Promise.all(
            floor.objects.map(async (object) => {
              const editorAsset = await this.editorAssetService.findByAssetPath(
                object.modelPath,
              );
              object.topImagePath = editorAsset.topImagePath;
              return object;
            }),
          );
          return { ...floor, objects };
        }),
      );
      response.viewerKey = result.viewerKey;
      return response;
    }

    return new FloorDto();
  }

  async upsert(dto: FloorDto, companyId: number) {
    const upsertData: {
      floor: string;
      company: { id: number };
      viewerKey?: string;
    } = {
      floor: JSON.stringify(dto),
      company: { id: companyId },
    };

    const floor = await Floor.findOne({
      where: { company: { id: companyId } },
    });
    if (!floor || !floor.viewerKey) {
      upsertData.viewerKey = randomBytes(30)
        .toString('base64url')
        .substring(0, 30);
    } else {
      upsertData.viewerKey = floor.viewerKey;
    }

    await Floor.upsert([upsertData], {
      conflictPaths: { company: true },
    });

    return await Floor.findOne({
      where: { company: { id: companyId } },
    });
  }
}
