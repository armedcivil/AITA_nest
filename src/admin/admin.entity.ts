import { Account } from '../account.entity';
import { Entity } from 'typeorm';

@Entity('admins')
export class Admin extends Account {}
