import { join } from 'path';
import { DataSourceOptions } from 'typeorm';
import 'dotenv/config';
import { migrations } from './database/migrations';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_SCHEMA,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: migrations,
  synchronize: false,
  logging: false,
};
