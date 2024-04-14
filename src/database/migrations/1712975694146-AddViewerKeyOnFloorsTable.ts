import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddViewerKeyOnFloorsTable1712975694146
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'floors',
      new TableColumn({
        name: 'viewer_key',
        type: 'varchar(30)',
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('floors', 'viewer_key');
  }
}
