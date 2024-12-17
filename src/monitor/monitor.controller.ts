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
  @HttpCode(HttpStatus.OK)
  async createMonitor(
    @Body(ValidationPipe) createMonitorDto: CreateMonitorDto,
    @Request() req,
  ) {
    const newMonitorDto = {
      user: req.user?.user?.username,
      module: createMonitorDto.module,
      time: dayjs().tz().format('YYYY-MM-DD HH:mm:ss'),
      type: createMonitorDto.type,
    };
    return await this.monitorService.create(newMonitorDto);
  }
}
