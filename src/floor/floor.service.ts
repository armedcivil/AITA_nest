import { Injectable } from '@nestjs/common';
import { FloorDto } from './floor.dto';
import { Floor } from './floor.entity';

@Injectable()
export class FloorService {
  constructor() {}

  async find(companyId: number): Promise<FloorDto> {
    const queryBuilder = Floor.createQueryBuilder();
    const query = queryBuilder
      .select()
      .where('company_id = :companyId', { companyId });
    const result = await query.getOne();

    if (result) {
      return JSON.parse(result.floor);
    }

    return new FloorDto();
  }

  async upsert(dto: FloorDto, companyId: number) {
    return await Floor.upsert(
      [{ floor: JSON.stringify(dto), company: { id: companyId } }],
      { conflictPaths: { company: true } },
    );
  }
}
