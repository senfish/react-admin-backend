import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { ArticleModule } from './article/article.module';
import { MonitorModule } from './monitor/monitor.module';
import { Monitor } from './monitor/entities/monitor.entity';
import { createClient } from 'redis';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      // host: '192.168.0.101',
      // host: 'localhost',
      host: 'mysql-container',
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
      synchronize: true,
      entities: [User, Monitor],
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
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            host: 'redis-container',
            // host: '192.168.0.101',
            // host: 'localhost',
            port: 6379,
          },
        });
        await client.connect();
        return client;
      },
    },
  ],
})
export class AppModule {}
