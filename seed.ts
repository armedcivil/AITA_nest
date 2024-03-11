import { DataSource } from 'typeorm';
import { dataSourceOptions } from './src/data-source.options';
import { Admin } from './src/admin/admin.entity';
import { hash } from 'bcrypt';

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

  process.exit();
})();
