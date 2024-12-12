import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from './public';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private refReflector: Reflector,
    @InjectRepository(User)
    private usesRepository: Repository<User>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.refReflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const tokens = request.headers?.authorization?.split(' ') || [];
    if (!tokens || tokens.length < 2) {
      throw new UnauthorizedException('token错误');
    }
    try {
      // 校验有效期之后，还需要从数据库里面查一下，这个人有没有被删？
      // TODO 应该从redis查，
      const tokenInfo = await this.jwtService.verifyAsync(tokens[1]);
      const sqlTarget = await this.usesRepository.findOneBy({
        id: tokenInfo.user.id,
      });
      if (!sqlTarget) {
        throw new UnauthorizedException('用户不存在，请重新注册');
      }
      request.user = tokenInfo;
      return true;
    } catch (e) {
      console.log('e: ', e);
      throw new UnauthorizedException('token已失效，请重新登录');
    }
  }
}
