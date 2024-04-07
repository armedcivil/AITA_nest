import {
  Controller,
  Get,
  Req,
  Post,
  Patch,
  Delete,
  Body,
  UnauthorizedException,
  UploadedFile,
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

@Controller('company/editor-asset')
export class EditorAssetController {
  constructor(
    private editorAssetService: EditorAssetService,
    private authService: AuthService,
  ) {}

  @Get()
  @Auth()
  @Role(['company'])
  async fetchAll(@Req() req: Request) {
    try {
      const token: string = await this.authService.extractTokenFromHeader(
        req.headers.authorization,
      );
      const payload: JwtPayload = await this.authService.checkAuth(token);
      return await this.editorAssetService.findAll(payload.id);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post()
  @Auth()
  @Role(['company'])
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

      thumbnailWriteStream.write(dto.thumbnailBlob);
      thumbnailWriteStream.close();

      return await this.editorAssetService.create(
        payload.id,
        assetPath,
        thumbnailPath,
        dto.isChair,
      );
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
