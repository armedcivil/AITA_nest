import { Injectable } from '@nestjs/common';
import { Company } from './company.entity';
import { CreateCompanyDto } from './company-create.dto';
import { UpdateCompanyDto } from './company-update.dto';
import { hash } from 'bcrypt';
import { DeleteResult, UpdateResult } from 'typeorm';

export type CompanyPager = {
  total: number;
  hasPrevious: boolean;
  hasNext: boolean;
  currentPage: number;
  maxPage: number;
  data: Company[];
};

@Injectable()
export class CompanyService {
  constructor() {}

  async all(page: number, limit: number = 10): Promise<CompanyPager> {
    const queryBuider = Company.createQueryBuilder();
    const companies: Company[] = await queryBuider
      .select()
      .addOrderBy('id')
      .offset((page - 1) * limit)
      .limit(limit)
      .getMany();

    const total = await Company.count();

    const maxPage = this.getMaxPage(total, limit);

    return {
      total,
      hasPrevious: page > 1,
      hasNext: page < maxPage,
      currentPage: page,
      maxPage,
      data: companies,
    };
  }

  async find(id: number): Promise<Company> {
    const company: Company = await Company.getRepository().findOne({
      where: { id: id },
    });
    return company;
  }

  async create(dto: CreateCompanyDto): Promise<Company> {
    const data = { ...dto };
    data.password = await hash(data.password, 10);
    return await Company.getRepository().create(data).save();
  }

  async update(id: number, dto: UpdateCompanyDto): Promise<UpdateResult> {
    const data = { ...dto };
    if (data.password) {
      data.password = await hash(data.password, 10);
      delete data.passwordConfirmation;
    }
    return await Company.getRepository().update(id, data);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await Company.getRepository().delete(id);
  }

  private getMaxPage(total: number, perPage: number) {
    return total % perPage > 0
      ? Math.floor(total / perPage) + 1
      : Math.floor(total / perPage);
  }
}
