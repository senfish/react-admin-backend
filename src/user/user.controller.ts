import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/public';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { DeleteUserDto, UpdateUserDto } from './dto/user.list.dto';
import { LoginDto } from './dto/login.dto';
import { MonitorService } from 'src/monitor/monitor.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    // private readonly monitorService: MonitorService,
  ) {}
  @Post('/login')
  @HttpCode(200)
  @Public()
  async login(
    @Body(ValidationPipe) body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.userService.login(body, response);
    return {
      data: {
        token,
      },
      code: '200',
      message: 'success',
    };
  }
  @Post('/register')
  // @Public()
  register(@Body(ValidationPipe) body: RegisterDto, @Req() req) {
    return this.userService.register(body, req);
  }
  @HttpCode(200)
  @Post('/update')
  async update(@Body() body: UpdateUserDto, @Req() req) {
    return {
      data: await this.userService.update(body, req),
      message: 'success',
      code: '200',
    };
  }
  @HttpCode(200)
  @Post('/delete')
  async delete(@Body('id') id: DeleteUserDto, @Req() req) {
    console.log('id: ', id);
    return {
      data: await this.userService.delete(id, req),
      message: 'success',
      code: '200',
    };
  }
  @HttpCode(200)
  @Post('/list')
  async list(@Body() body) {
    console.log('body: ', body);
    return {
      data: await this.userService.list(body),
      message: 'success',
      code: '200',
    };
  }
  @HttpCode(200)
  @Post('/user_info')
  async getUserInfo(@Req() req) {
    delete req?.user?.user?.password;
    return {
      data: req?.user?.user,
      message: 'success',
      code: '200',
    };
  }
}
