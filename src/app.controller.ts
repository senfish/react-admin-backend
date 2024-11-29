import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Public } from './public';
import { RedisClientType } from 'redis';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private dataSource: DataSource,
  ) {}

  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;
  @ApiOperation({
    summary: 'hello',
    description: 'hello',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功',
    type: String,
  })
  @ApiQuery({
    name: 'username',
    description: 'username',
    type: String,
  })
  @ApiQuery({
    name: 'password',
    description: 'password',
    type: String,
  })
  @Get()
  @Public()
  async getHello(@Query() query): Promise<string> {
    console.log('query: ', query);
    // this.dataSource.getRepository().findOne({})
    const keys = await this.redisClient.keys(`*`);
    console.log('keys:===> ', keys);

    return this.appService.getHello();
  }
}
