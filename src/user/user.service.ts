import {
  HttpException,
  HttpStatus,
  Injectable,
  Request,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto, UserListRequestDto } from './dto/user.list.dto';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { MonitorService } from 'src/monitor/monitor.service';
import * as dayjs from 'dayjs';
import { MODULE_MAP } from 'src/const/monitor';

const md5 = (str) => {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
};
@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    private monitorService: MonitorService,
  ) {}
  @InjectRepository(User)
  private usesRepository: Repository<User>;
  async login(body: LoginDto, response: Response) {
    const target = await this.usesRepository.findOneBy({
      username: body.username,
    });
    console.log('target: ', target);

    if (!target) {
      throw new HttpException(
        {
          code: '10001',
          message: '用户不存在',
          data: null,
        },
        200,
      );
    }
    if (target?.password === md5(body.password)) {
      const token = await this.jwtService.signAsync({
        sub: target.id,
        user: target,
      });
      response.setHeader('token', token);
      this.monitorService.create({
        user: body.username,
        module: MODULE_MAP.USER_LOGIN,
        time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        type: 4,
      });

      return token;
    }
    throw new HttpException(
      {
        code: '10001',
        message: '密码错误',
        data: null,
      },
      HttpStatus.OK,
    );
  }
  async register(body: RegisterDto, request) {
    const target = await this.usesRepository.findOneBy({
      username: body.username,
    });
    if (target) {
      throw new HttpException(
        {
          code: '10001',
          message: '用户已存在',
          data: null,
        },
        200,
      );
    }
    const user = new User();
    user.username = body.username;
    user.password = md5('123456');
    user.role = Number(body.role);
    await this.usesRepository.save(user);
    // 类型, 1: 新增，2: 修改，3: 删除，4: 登录 /int
    this.monitorService.create({
      user: request.user?.user?.username,
      module: MODULE_MAP.USER_MANAGE,
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      type: 1,
    });
    return new HttpException(
      {
        message: 'success',
        code: '200',
        data: null,
      },
      200,
    ).getResponse();
  }
  async list(body: UserListRequestDto) {
    console.log('body: ', body);
    const mergeOption = Object.assign(
      {
        pageSize: 10,
        pageNum: 1,
      },
      body,
    ) as unknown as UserListRequestDto;
    const skip = (mergeOption.pageNum - 1) * mergeOption.pageSize;
    const [data, total] = await this.usesRepository.findAndCount({
      skip,
      take: mergeOption.pageSize,
      order: {
        id: 'DESC',
      },
    });
    data.map((item) => {
      delete item.password;
    });
    return {
      data,
      total,
      pageNum: mergeOption.pageNum,
      pageSize: mergeOption.pageSize,
    };
  }
  async delete(id, @Request() request) {
    const target = await this.usesRepository.findOne({
      where: {
        id,
      },
    });
    if (target?.username === 'admin') {
      throw new HttpException(
        {
          code: '10001',
          message: 'admin用户不允许删除',
          data: null,
        },
        200,
      );
    }
    const data = await this.usesRepository.delete({
      id,
    });
    console.log('data: ', data);

    if (data.affected === 1) {
      // 类型, 1: 新增，2: 修改，3: 删除，4: 登录 /int
      this.monitorService.create({
        user: request.user?.user?.username,
        module: MODULE_MAP.USER_MANAGE,
        time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        type: 3,
      });
      return '删除成功';
    } else {
      throw new HttpException(
        {
          code: '10001',
          message: 'id不存在',
          data: null,
        },
        200,
      );
    }
  }
  async update(body: UpdateUserDto, request) {
    if (!body.id) throw new HttpException('id is required', 200);
    const findUers = await this.usesRepository.findOneBy({
      id: body.id,
    });
    findUers.role = Number(body.role);
    await this.usesRepository.save(findUers);
    // 类型, 1: 新增，2: 修改，3: 删除，4: 登录 /int
    this.monitorService.create({
      user: request.user?.user?.username,
      module: MODULE_MAP.USER_MANAGE,
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      type: 2,
    });
    return 'success';
  }
}
