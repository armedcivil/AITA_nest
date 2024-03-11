import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Admin } from './admin.entity';

@Injectable()
export class AdminService {
  constructor(private dataSource: DataSource) {}

  async findByEmail(email: string) {
    const adminRepository = this.dataSource.getRepository(Admin);
    return await adminRepository.findOneBy({ email: email });
  }
}
