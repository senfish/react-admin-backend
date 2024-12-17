import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Monitor } from './monitor/entities/monitor.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { ArticleModule } from './article/article.module';
import { MonitorModule } from './monitor/monitor.module';
import { createClient } from 'redis';
import { ConfigService, ConfigModule } from '@nestjs/config';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Shanghai');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'], // 前面的配置地址权重更高（前覆盖后）
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          host: config.get('MYSQL_HOST'),
          port: config.get('MYSQL_PORT'),
          username: config.get('MYSQL_USERNAME'),
          password: config.get('MYSQL_PASSWORD'),
          database: 'login_test',
          logging: true,
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: {
            authPlugin: 'sha256_password',
          },
          synchronize: true,
          timezone: 'Z',
          entities: [User, Monitor],
        } as TypeOrmModuleOptions;
      },
    }),
    JwtModule.register({
      global: true,
      secret: 'sens',
      signOptions: { expiresIn: '7d' },
    }),
    UserModule,
    ArticleModule,
    MonitorModule,
  ],
  controllers: [AppController],
  exports: [JwtModule],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      async useFactory(config: ConfigService) {
        const client = createClient({
          socket: {
            host: config.get('RD_HOST'),
            port: config.get('RD_PORT'),
          },
        });
        await client.connect();
        return client;
      },
    },
  ],
})
export class AppModule {}
