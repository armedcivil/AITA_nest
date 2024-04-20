import { Module } from '@nestjs/common';
import { FloorService } from './floor.service';
import { EditorAssetModule } from 'src/editor-asset/editor-asset.module';

@Module({
  imports: [EditorAssetModule],
  providers: [FloorService],
  exports: [FloorService],
})
export class FloorModule {}
