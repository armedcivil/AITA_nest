import { Module } from '@nestjs/common';
import { EditorAssetService } from './editor-asset.service';
import { EditorAssetController } from './editor-asset.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [EditorAssetService],
  controllers: [EditorAssetController],
  exports: [EditorAssetService],
})
export class EditorAssetModule {}
