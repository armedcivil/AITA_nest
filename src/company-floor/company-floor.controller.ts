import { Controller, Get, Post, Req, Body, Query, Param } from '@nestjs/common';
import { Request } from 'express';
import { Auth } from 'src/auth/auth.decorator';
import { AuthService } from 'src/auth/auth.service';
import { Role } from 'src/role/role.decorator';
import { JwtPayload } from 'src/auth/auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { FloorService } from 'src/floor/floor.service';
import { FloorDto } from 'src/floor/floor.dto';

@Controller('company/floor')
export class CompanyFloorController {
  constructor(
    private authService: AuthService,
    private floorService: FloorService,
  ) {}

  @Get()
  @Auth()
  @Role(['company', 'user'])
  async find(@Req() req: Request) {
    try {
      const token: string = await this.authService.extractTokenFromHeader(
        req.headers.authorization,
      );
      const payload: JwtPayload = await this.authService.checkAuth(token);

      if (payload.roles.includes('company')) {
        return await this.floorService.find(payload.id);
      } else if (payload.roles.includes('user')) {
        return await this.floorService.find(null, payload.id);
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get('/:viewerKey')
  async findByViewerKey(@Param('viewerKey') viewerKey) {
    return await this.floorService.find(null, null, viewerKey);
  }

  @Post()
  @Auth()
  @Role(['company'])
  async upsert(@Req() req: Request, @Body() dto: FloorDto) {
    try {
      const token: string = await this.authService.extractTokenFromHeader(
        req.headers.authorization,
      );
      const payload: JwtPayload = await this.authService.checkAuth(token);
      return await this.floorService.upsert(dto, payload.id);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
