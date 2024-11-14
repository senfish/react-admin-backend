import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { InfoService } from './info.service';
import { AuthGuard } from 'src/auth.guard';

@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}
  @Get('/list')
  async getInfoList(@Body() body) {
    console.log('body: ', body);
    return body;
  }
}
