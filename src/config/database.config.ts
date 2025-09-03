import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as dotenv from 'dotenv';
dotenv.config();
export const typeormConfig: TypeOrmModuleOptions = {

      type: 'postgres',
      host: process.env.PGHOST || 'auth_postgres',
      port: parseInt(process.env.PGPORT) || 5432,
      username: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: process.env.PGDATABASE || 'otp_saas',
      autoLoadEntities: true,
      synchronize: true, // ❌ turn off in production (use migrations)
    logging: false
}
export default registerAs('database', () => ({
    ...typeormConfig
}));


