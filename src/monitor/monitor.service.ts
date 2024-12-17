import { HttpException, Injectable } from '@nestjs/common';
import { CreateMonitorDto, MonitorType } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Monitor } from './entities/monitor.entity';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { MonitorListDto } from './dto/list-monitor.dto';
import * as dayjs from 'dayjs';
import { BSONVersionError } from 'typeorm/driver/mongodb/bson.typings';

@Injectable()
export class MonitorService {
  constructor(
    @InjectRepository(Monitor)
    private usesRepository: Repository<Monitor>,
  ) {}
  async create(createMonitorDto: CreateMonitorDto) {
    try {
      const monitor = new Monitor();
      monitor.module = createMonitorDto.module;
      monitor.time = dayjs(createMonitorDto.time).toDate();
      monitor.user = createMonitorDto.user;
      monitor.type = createMonitorDto.type;
      await this.usesRepository.save(monitor);
      return new HttpException(
        {
          code: '200',
          message: 'success',
          data: null,
        },
        200,
      ).getResponse();
    } catch (err) {
      console.log('err: ', err);
      throw new HttpException('创建失败', 200).getResponse();
    }
  }
  async list(body: MonitorListDto = {}) {
    const mergeOption = Object.assign(
      {
        pageSize: 10,
        pageNum: 1,
      },
      body,
    ) as unknown as MonitorListDto;
    const skip = (mergeOption.pageNum - 1) * mergeOption.pageSize;
    console.log('body: ', body);

    const where: FindOptionsWhere<Monitor> = {};

    if (body.time) {
      const startTime = dayjs(body.time[0]).toDate();
      const endTime = dayjs(body.time[1]).add(1, 'day').toDate();
      where['time'] = Between(startTime, endTime);
    }
    if (body.user) {
      where['user'] = body.user;
    }
    if (body.type) {
      where['type'] = Number(body.type) as MonitorType;
    }
    const [data, total] = await this.usesRepository.findAndCount({
      skip,
      take: mergeOption.pageSize,
      where,
      order: {
        time: 'DESC',
      },
    });

    const newData = data.map((item) => {
      return {
        ...item,
        time: dayjs(item.time).format('YYYY-MM-DD HH:mm:ss'),
      };
    });
    return {
      data: newData,
      total,
      pageNum: mergeOption.pageNum,
      pageSize: mergeOption.pageSize,
    };
  }
}
