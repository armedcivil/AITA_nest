import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnIconImagePathOnUser1710882512966
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'icon_image_path',
        type: 'varchar(256)',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'icon_image_path');
  }
}
