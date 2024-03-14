import { Exclude } from 'class-transformer';
import { Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

export class Account extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;
}
