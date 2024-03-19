import { Company } from '../company/company.entity';
import { Account } from '../account.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('users')
export class User extends Account {
  @ManyToOne(() => Company, (company) => company.users)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'icon_image_path' })
  iconImagePath: string;
}
