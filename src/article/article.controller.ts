import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleListReqDto } from './dto/get-articles.dto';
import { requestArticle } from 'src/common/request';
import { Public } from 'src/public';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('/article_list')
  @HttpCode(200)
  async getArticleList(@Body() body: ArticleListReqDto) {
    const { currentTag = '1' } = body;
    const info = (await requestArticle(body)) as unknown as any;
    const data = info?.data?.map((item) => {
      return {
        title: item.article_info.title,
        brief_content: item.article_info.brief_content,
        comment_count: item.article_info.comment_count,
        view_count: item.article_info.view_count,
        digg_count: item.article_info.digg_count,
        article_id: item.article_info.article_id,
        collect_count: item.article_info.collect_count,
      };
    });
    if (currentTag === '2') {
      data.sort((a, b) => b.digg_count - a.digg_count);
    } else if (currentTag === '3') {
      data.sort((a, b) => b.collect_count - a.collect_count);
    }
    return {
      data: data,
      code: '200',
      message: 'success',
    };
  }
}
