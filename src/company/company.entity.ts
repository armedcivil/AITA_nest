import { Account } from '../account.entity';
import { User } from '../user/user.entity';
import { Entity, OneToMany } from 'typeorm';

@Entity('companies')
export class Company extends Account {
  @OneToMany(() => User, (user) => user.company, { cascade: true })
  users: User[];
}
