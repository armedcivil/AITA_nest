import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Req,
  Query,
  Body,
  Param,
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
@UseInterceptors(ClassSerializerInterceptor)
export class ReservationController {
  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
  ) {}

  @Get()
  async findAll(@Query('sheet_id') sheetId) {
    return this.reservationService.find(sheetId, new Date());
  }

  @Post()
  @Auth()
  @Role(['user'])
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

  @Patch('/:id')
  @Auth()
  @Role(['user'])
  async update(
    @Req() req: Request,
    @Param('id') reservationId: string,
    @Body() dto: ReservationDto,
  ) {
    try {
      const token: string = this.authService.extractTokenFromHeader(
        req.headers.authorization,
      );

      const payload: JwtPayload = this.authService.checkAuth(token);

      return this.reservationService.update(
        payload.id,
        Number(reservationId),
        dto,
      );
    } catch (e: any) {
      throw new UnauthorizedException();
    }
  }

  @Delete('/:id')
  @Auth()
  @Role(['user'])
  async delete(@Req() req: Request, @Param('id') reservationId: string) {
    try {
      const token: string = this.authService.extractTokenFromHeader(
        req.headers.authorization,
      );

      const payload: JwtPayload = this.authService.checkAuth(token);

      return this.reservationService.delete(payload.id, Number(reservationId));
    } catch (e: any) {
      throw new UnauthorizedException();
    }
  }
}
