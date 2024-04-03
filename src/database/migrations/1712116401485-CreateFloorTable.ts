import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFloorTable1712116401485 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'floors',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'floor',
            type: 'longtext',
          },
          {
            name: 'company_id',
            type: 'bigint',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('floors', true);
  }
}
