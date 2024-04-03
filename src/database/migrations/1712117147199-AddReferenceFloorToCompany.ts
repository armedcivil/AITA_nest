import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddReferenceFloorToCompany1712117147199
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'floors',
      new TableForeignKey({
        name: 'floor_company_foreign_key',
        columnNames: ['company_id'],
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('floors', 'floor_company_foreign_key');
  }
}
