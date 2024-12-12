import { DataSource } from 'typeorm';
import { User } from './user/entities/user.entity';
import { Monitor } from './monitor/entities/monitor.entity';

export default new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'sens',
  database: 'login_test',
  logging: true,
  poolSize: 10,
  connectorPackage: 'mysql2',
  extra: {
    authPlugin: 'sha256_password',
  },
  synchronize: false,
  timezone: '+08:00',
  entities: [User, Monitor],
  migrations: ['src/migrations/**.ts'],
});
