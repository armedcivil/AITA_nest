import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddAssetPathIndexToEditorAssetsTable1713577297190
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'editor_assets',
      new TableIndex({ name: 'index_asset_path', columnNames: ['asset_path'] }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('editor_assets', 'index_asset_path');
  }
}
