import { Injectable } from '@nestjs/common';
import { Reservation } from './reservation.entity';

@Injectable()
export class ReservationService {
  async find(sheetId: string, currentTimestamp: Date, limit?: number) {
    const query = Reservation.createQueryBuilder()
      .select()
      .where({ sheetId })
      .andWhere('end_timestamp > :currentTimestamp', { currentTimestamp })
      .orderBy('start_timestamp');

    if (limit) {
      query.limit(limit);
    }

    return { reservations: await query.getMany() };
  }
}
