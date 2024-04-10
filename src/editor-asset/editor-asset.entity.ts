import {
  Column,
  ManyToOne,
  BaseEntity,
  JoinColumn,
  PrimaryGeneratedColumn,
  Entity,
} from 'typeorm';
import { Company } from '../company/company.entity';

@Entity('editor_assets')
export default class EditorAsset extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, (company) => company.editorAssets)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'asset_path' })
  assetPath: string;

  @Column({ name: 'thumbnail_path' })
  thumbnailPath: string;

  @Column({ name: 'top_image_path' })
  topImagePath: string;

  @Column({ name: 'is_chair' })
  isChair: boolean;
}
