import {
  Controller,
  Get,
  Post,
  Req,
  Query,
  Body,
  UnauthorizedException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { Auth } from 'src/auth/auth.decorator';
import { Role } from 'src/role/role.decorator';
import { Request } from 'express';
import { ReservationDto } from './reservation.dto';
import { AuthService, JwtPayload } from 'src/auth/auth.service';

@Controller('reservation')
export class ReservationController {
  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
  ) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query('sheet_id') sheetId) {
    return this.reservationService.find(sheetId, new Date());
  }

  @Post()
  @Auth()
  @Role(['user'])
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Req() req: Request, @Body() dto: ReservationDto) {
    try {
      const token: string = this.authService.extractTokenFromHeader(
        req.headers.authorization,
      );

      const payload: JwtPayload = this.authService.checkAuth(token);

      return this.reservationService.create(payload.id, dto);
    } catch (e: any) {
      throw new UnauthorizedException();
    }
  }
}
