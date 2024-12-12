import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
import { MonitorListDto } from './dto/list-monitor.dto';
import * as dayjs from 'dayjs';

@Controller('monitor')
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  @Post('/monitor_list')
  @HttpCode(HttpStatus.OK)
  async getMonitorList(@Body() listDto: MonitorListDto = {}) {
    return {
      code: '200',
      data: await this.monitorService.list(listDto),
      message: 'success',
    };
  }

  @Post('/track')
  async createMonitor(
    @Body(ValidationPipe) createMonitorDto: CreateMonitorDto,
    @Request() req,
  ) {
    console.log('req', req.user);
    console.log('createMonitorDto: ', createMonitorDto);
    const newMonitorDto = {
      user: req.user?.user?.username,
      module: createMonitorDto.module,
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      type: createMonitorDto.type,
    };
    console.log('newMonitorDto: ', newMonitorDto);
    return await this.monitorService.create(createMonitorDto);
  }
}
