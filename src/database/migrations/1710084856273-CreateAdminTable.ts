import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAdminTable1710084856273 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'admins',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar(255)',
          },
          {
            name: 'email',
            type: 'varchar(255)',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar(255)',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('admins', true);
  }
}
