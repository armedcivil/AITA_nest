import { BadRequestException, Injectable } from '@nestjs/common';
import { Reservation } from './reservation.entity';
import { User } from 'src/user/user.entity';
import { ReservationDto } from './reservation.dto';
import { Brackets, NotBrackets } from 'typeorm';

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

  async create(userId: number, dto: ReservationDto) {
    // Check already reserved
    const reserved = await Reservation.createQueryBuilder()
      .select()
      .where({ sheetId: dto.sheetId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('start_timestamp < :endTimestamp', {
            endTimestamp: dto.endTimestamp,
          }).andWhere('end_timestamp > :startTimestamp', {
            startTimestamp: dto.startTimestamp,
          });
        }),
      )
      .getOne();

    if (reserved) {
      throw new BadRequestException('Already reserved');
    }

    const reservation = new Reservation();
    reservation.sheetId = dto.sheetId;
    reservation.startTimestamp = new Date(dto.startTimestamp);
    reservation.endTimestamp = new Date(dto.endTimestamp);

    const user = await User.findOne({ where: { id: userId } });
    reservation.user = user;

    return await reservation.save();
  }

  async update(userId: number, reservationId: number, dto: ReservationDto) {
    const reservation = await Reservation.createQueryBuilder()
      .select()
      .where({ user: { id: userId } })
      .andWhere('id = :reservationId', { reservationId })
      .getOne();

    if (!reservation) {
      throw new BadRequestException();
    }

    const reserved = await Reservation.createQueryBuilder()
      .select()
      .where({ sheetId: reservation.sheetId })
      .andWhere(
        new NotBrackets((qb) => {
          qb.where({ id: reservationId });
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where('start_timestamp < :endTimestamp', {
            endTimestamp: dto.endTimestamp,
          }).andWhere('end_timestamp > :startTimestamp', {
            startTimestamp: dto.startTimestamp,
          });
        }),
      )
      .getOne();
    if (reserved) {
      throw new BadRequestException('Already reserved');
    }

    reservation.startTimestamp = new Date(dto.startTimestamp);
    reservation.endTimestamp = new Date(dto.endTimestamp);

    return await reservation.save();
  }

  async delete(userId: number, reservationId: number) {
    const reservation = await Reservation.createQueryBuilder()
      .select()
      .where({ user: { id: userId } })
      .andWhere('id = :reservationId', { reservationId })
      .getOne();

    if (!reservation) {
      throw new BadRequestException();
    }

    return await reservation.remove();
  }
}
