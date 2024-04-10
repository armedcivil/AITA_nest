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
  Param,
  ForbiddenException,
} from '@nestjs/common';
import { Auth } from 'src/auth/auth.decorator';
import { Role } from 'src/role/role.decorator';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { EditorAssetService } from './editor-asset.service';
import { JwtPayload } from 'src/auth/auth.service';
import { EditorAssetCreate } from './editor-asset-create.dto';
import { join } from 'path';
import { createWriteStream, rmSync } from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { resourceUsage } from 'process';

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

      const topImagePath = join(
        'uploaded',
        'models',
        `top_${payload.id}_${fileIdentifier}.png`,
      );

      const topImageWriteStream = createWriteStream(
        join(__dirname, '..', '..', '..', 'public', topImagePath),
      );
      const topImageArrayBuffer = await fetch(dto.topImage)
        .then((response) => response.blob())
        .then((blob) => blob.arrayBuffer());
      topImageWriteStream.write(Buffer.from(topImageArrayBuffer));
      topImageWriteStream.close();

      return await this.editorAssetService.create(
        payload.id,
        assetPath,
        thumbnailPath,
        topImagePath,
        dto.isChair ? true : false,
      );
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Delete('/:id')
  @Auth()
  @Role(['company'])
  async delete(@Req() req: Request, @Param('id') id) {
    const token: string = await this.authService.extractTokenFromHeader(
      req.headers.authorization,
    );

    let payload: JwtPayload = undefined;
    try {
      payload = await this.authService.checkAuth(token);
    } catch (e) {
      throw new UnauthorizedException();
    }

    if (payload) {
      const willDeleteEditorAsset = await this.editorAssetService.find(
        payload.id,
        Number(id),
      );

      if (willDeleteEditorAsset) {
        const base = join(__dirname, '..', '..', '..', 'public');
        rmSync(join(base, willDeleteEditorAsset.assetPath));
        rmSync(join(base, willDeleteEditorAsset.thumbnailPath));
        rmSync(join(base, willDeleteEditorAsset.topImagePath));
        const result = await this.editorAssetService.delete(
          willDeleteEditorAsset.id,
        );
        if (result.affected) {
          return { result: 'success' };
        } else {
          return { result: 'failure' };
        }
      } else {
        throw new ForbiddenException();
      }
    }
  }
}
