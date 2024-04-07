import { IsNotEmpty } from 'class-validator';

export class EditorAssetCreate {
  @IsNotEmpty()
  thumbnailBlob: Blob;

  @IsNotEmpty()
  isChair: boolean;
}
