import { User } from 'src/user/user.entity';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
  ManyToOne,
} from 'typeorm';

@Entity('reservations')
export class Reservation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column({ name: 'start_timestamp' })
  startTimestamp: Date;

  @Column({ name: 'end_timestamp' })
  endTimestamp: Date;

  @Column({ name: 'sheet_id' })
  sheetId: string;

  @ManyToOne(() => User, (user) => user.reservations)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
