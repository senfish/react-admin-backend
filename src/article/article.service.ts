import { Injectable } from '@nestjs/common';
import { ArticleListReqDto } from './dto/get-articles.dto';

@Injectable()
export class ArticleService {
  async getList(body: ArticleListReqDto) {
    console.log('body: ', body);
  }
}
