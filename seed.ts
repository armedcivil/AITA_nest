import { DataSource } from 'typeorm';
import { dataSourceOptions } from './src/data-source.options';
import { Admin } from './src/admin/admin.entity';
import { hash } from 'bcrypt';
import { Company } from './src/company/company.entity';
import { User } from './src/user/user.entity';

(async () => {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize().catch((err) => {
    console.log(err);
  });

  const adminRepository = dataSource.getRepository(Admin);
  const admin: Admin = new Admin();
  admin.name = 'hseino';
  admin.email = 'hseino@armedcivil.com';
  admin.password = await hash('adminadmin', 10);
  await adminRepository.save(admin);

  const compnayRepogitory = dataSource.getRepository(Company);
  for (let i = 0; i < 40; i++) {
    const company = new Company();
    company.name = `company${i + 1}`;
    company.email = `company${i + 1}@example.com`;
    company.password = await hash('password', 10);
    company.users = [];
    for (let n = 0; n < 40; n++) {
      const user = new User();
      user.name = `company${i + 1}user${n + 1}`;
      user.email = `company${i + 1}user${n + 1}@example.com`;
      user.password = await hash('password', 10);
      company.users.push(user);
    }
    await compnayRepogitory.save(company);
  }

  process.exit();
})();
