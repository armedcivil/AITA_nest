import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateReservationsTable1713204939011
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'reservations',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'start_timestamp', type: 'datetime' },
          { name: 'end_timestamp', type: 'datetime' },
          { name: 'sheet_id', type: 'varchar(36)' },
          { name: 'user_id', type: 'bigint' },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'reservations',
      new TableForeignKey({
        name: 'reservation_user_foreign_key',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'reservations',
      'reservation_user_foreign_key',
    );
    await queryRunner.dropTable('reservations');
  }
}
