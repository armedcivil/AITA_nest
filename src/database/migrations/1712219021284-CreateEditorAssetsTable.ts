import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateEditorAssetsTable1712219021284
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'editor_assets',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'asset_path',
            type: 'varchar(255)',
          },
          {
            name: 'thumbnail_path',
            type: 'varchar(255)',
          },
          {
            name: 'top_image_path',
            type: 'varchar(255)',
          },
          {
            name: 'company_id',
            type: 'bigint',
          },
          {
            name: 'is_chair',
            type: 'boolean',
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'editor_assets',
      new TableForeignKey({
        name: 'editor_asset_company_foreign_key',
        columnNames: ['company_id'],
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'editor_assets',
      'editor_asset_company_foreign_key',
    );
    await queryRunner.dropTable('editor_assets');
  }
}
