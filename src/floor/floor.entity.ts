import { Company } from '../company/company.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('floors')
export class Floor extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Company, (company) => company.floor)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column()
  floor: string;
}
