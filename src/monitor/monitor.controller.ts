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
} from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
import { MonitorListDto } from './dto/list-monitor.dto';

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

  @Post('/create')
  async createMonitor(
    @Body(ValidationPipe) createMonitorDto: CreateMonitorDto,
  ) {
    return await this.monitorService.create(createMonitorDto);
  }
}
