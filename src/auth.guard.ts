import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

// 主要就是拿到resquest，然后你自己根据业务逻辑对request进行一些处理、拦截
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
