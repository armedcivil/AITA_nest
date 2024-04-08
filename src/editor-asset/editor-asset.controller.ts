import {
  Controller,
  Get,
  Req,
  Post,
  Patch,
  Delete,
  Query,
  Body,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Auth } from 'src/auth/auth.decorator';
import { Role } from 'src/role/role.decorator';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { EditorAssetService } from './editor-asset.service';
import { JwtPayload } from 'src/auth/auth.service';
import { EditorAssetCreate } from './editor-asset-create.dto';
import { join } from 'path';
import { createWriteStream } from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('company/editor-asset')
export class EditorAssetController {
  constructor(
    private editorAssetService: EditorAssetService,
    private authService: AuthService,
  ) {}

  @Get()
  @Auth()
  @Role(['company'])
  async fetchAll(
    @Req() req: Request,
    @Query('page') page: string,
    @Query('order') order: 'asc' | 'desc' = 'asc',
  ) {
    try {
      const token: string = await this.authService.extractTokenFromHeader(
        req.headers.authorization,
      );
      const payload: JwtPayload = await this.authService.checkAuth(token);
      return await this.editorAssetService.findAll(payload.id, page, order);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post()
  @Auth()
  @Role(['company'])
  @UseInterceptors(FileInterceptor('asset'))
  async create(
    @Req() req: Request,
    @UploadedFile() file,
    @Body() dto: EditorAssetCreate,
  ) {
    try {
      const token: string = await this.authService.extractTokenFromHeader(
        req.headers.authorization,
      );
      const payload: JwtPayload = await this.authService.checkAuth(token);

      const fileIdentifier = new Date().getTime();
      let assetPath: string | undefined = undefined;
      if (file.size > 0) {
        assetPath = join(
          'uploaded',
          'models',
          `model_${payload.id}_${fileIdentifier}.glb`,
        );

        const writeStream = createWriteStream(
          join(__dirname, '..', '..', '..', 'public', assetPath),
        );
        writeStream.write(file.buffer);
        writeStream.close();
      }

      const thumbnailPath = join(
        'uploaded',
        'models',
        `thumbnail_${payload.id}_${fileIdentifier}.png`,
      );

      const thumbnailWriteStream = createWriteStream(
        join(__dirname, '..', '..', '..', 'public', thumbnailPath),
      );
      const arrayBuffer = await fetch(dto.thumbnail)
        .then((response) => response.blob())
        .then((blob) => blob.arrayBuffer());
      thumbnailWriteStream.write(Buffer.from(arrayBuffer));
      thumbnailWriteStream.close();

      return await this.editorAssetService.create(
        payload.id,
        assetPath,
        thumbnailPath,
        dto.isChair ? true : false,
      );
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
