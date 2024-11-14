## 踩坑

生成一个user 的 resource

```bash

nest g resource user
```

### findOneBy

```ts
const foundUser = await this.userRepository.findOneBy({
  username: loginDto.username,
});
```

如果findOneBy给了一个undefined的值，会从数据库里面找到第一个条数据，所以一定要进行undefined拦截

## Guard 守卫

Guard可以作用在controller、method、global-scoped，可以使用UseGuard()来设置一个controller级别的守卫

### method设置Guard

```ts
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  @Get('getList')
  @UseGuards(AuthGuard)
  async test(@Request() req) {
    return req.user;
  }
}
```

### controller设置Guard

```ts
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  @Get('getList')
  async test(@Request() req) {
    return req.user;
  }
}
```

### Global

```ts
const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new AuthGuard());
```

[原地址](https://blog.csdn.net/gwdgwd123/article/details/106119226)
注意：
如果AuthGuard里面已经用了其他的service，会出现错误

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/bfde07aea990413ca47230864124a7d2~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgc2Vuc0Zlbmc=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzg2MTE0MDU2OTA3Nzk1MCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1731675248&x-orig-sign=qOKhPl%2FTHKa99tLtEmb9Qw4e1XM%3D)

### 新增AuthGuard对接口进行拦截

守卫是在所有中间件之后，任何拦截器/管道之前执行

```ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authorization = request.header('authorization') || '';
    const bearer = authorization.split(' ');
    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException('登录token错误');
    }
    const token = bearer[1];
    try {
      const info = await this.jwtService.verifyAsync(token);
      request['user'] = info;
    } catch (err) {
      throw new UnauthorizedException('登录 token 失效，请重新登录', err);
    }
    return true;
  }
}
```

用法

```ts
// service里面
  @Get('a')
  @UseGuards(AuthGuard)
  async test(@Request() req) {
    return req.user;
  }
```
