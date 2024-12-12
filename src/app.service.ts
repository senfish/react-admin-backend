import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService) {}
  getHello(): string {
    const env = this.config.get('CUR_ENV');
    console.log('env: ', env);
    return 'Hello World!' + env;
  }
}
