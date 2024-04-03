import { Floor } from '../floor/floor.entity';
import { Account } from '../account.entity';
import { User } from '../user/user.entity';
import { Entity, OneToMany, OneToOne } from 'typeorm';

@Entity('companies')
export class Company extends Account {
  @OneToMany(() => User, (user) => user.company, { cascade: true })
  users: User[];

  @OneToOne(() => Floor, (floor) => floor.company, { cascade: true })
  floor: Floor;
}
