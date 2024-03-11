import { Account } from '../account.entity';
import { Entity } from 'typeorm';

@Entity('companies')
export class Company extends Account {}
