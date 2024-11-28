
项目启动之后，添加一个user模块
## 创建 user 模块
```ts
npm g resource user
```

## 连接数据库

```bash
npm install --save @nestjs/typeorm typeorm mysql2
```

### 创建 user 实体类
user/entities/user.entity.ts

```ts
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  // 主键
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '用户名',
  })
  username: string;

  @Column({
    length: 50,
    comment: '密码',
  })
  password: string;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateTime: Date;
}

```


在AppModule里面引入TypeOrmModule，并且添加user实体类

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3000,
      username: 'root',
      password: 'sens',
      logging: true,
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      },
      synchronize: true,
      entities: [User],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```
### 子模块操作数据库

#### 在user模块内注册存储库
user/user.module.ts
```ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

#### 再注入User对应的Repository

```ts
export class UserService {
  constructor(
    @InjectRepository(User)
    private usesRepository: Repository<User>,
  ) {}

}

```
然后就可以在userService里面用存储库的方法来操作数据库了。

完善一下register/login的逻辑


### 加入jwt

```bash
 npm install @nestjs/jwt
```