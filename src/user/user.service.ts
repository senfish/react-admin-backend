import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

function md5(str) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}
@Injectable()
export class UserService {
  constructor(private readonly jwtService: JwtService) {}
  @InjectRepository(User)
  private userRepository: Repository<User>; // 操作数据库的api
  private logger = new Logger();

  async register(user: RegisterDto) {
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });
    if (foundUser) {
      throw new HttpException('用户已存在', 200);
    }
    // 添加用户
    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);
    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (err) {
      this.logger.error(err, UserService);
      return '注册失败';
    }
  }

  async login(loginDto: LoginDto) {
    // findOneBy如果给了一个undefined的值，会返回第一条数据
    const foundUser = await this.userRepository.findOneBy({
      username: loginDto.username,
    });
    if (!foundUser) {
      throw new HttpException('用户不存在', 200);
    }
    //  找到了用户名，比较密码
    const newPassword = md5(loginDto.password);
    if (foundUser.password === newPassword) {
      const token = await this.jwtService.sign({
        user: {
          id: foundUser.id,
          username: foundUser.username,
        },
      });
      return {
        token,
      };
    } else {
      return '密码错误';
    }
  }
  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  // findAll() {
  //   return `This action returns all user`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
