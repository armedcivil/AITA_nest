import { Injectable } from '@nestjs/common';
import { FloorDto } from './floor.dto';
import { Floor } from './floor.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class FloorService {
  constructor() {}

  async find(companyId?: number, viewerKey?: string): Promise<FloorDto> {
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
