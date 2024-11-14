import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly jwtService: JwtService,
  ) {}
  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }
  // @Post('/login')
  // login(@Body() dto: { user_name: string; password: string }) {
  //   const token = this.jwtService.sign(
  //     {
  //       name: dto.user_name,
  //       sub: dto.password,
  //     },
  //     {
  //       secret: 'sens',
  //     },
  //   );
  //   console.log('tokens: ', token);
  //   return {
  //     token,
  //   };
  // }
}
