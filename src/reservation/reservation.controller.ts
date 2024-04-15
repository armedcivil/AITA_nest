import { Controller, Get, Query } from '@nestjs/common';
import { ReservationService } from './reservation.service';

@Controller('reservation')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Get()
  async findAll(@Query('sheet_id') sheetId) {
    return this.reservationService.find(sheetId, new Date());
  }
}
