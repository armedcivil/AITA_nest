import { IsNotEmpty } from 'class-validator';

export class EditorAssetCreate {
  @IsNotEmpty()
  thumbnail: string;

  @IsNotEmpty()
  isChair: boolean;
}
