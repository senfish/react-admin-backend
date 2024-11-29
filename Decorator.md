## 参数装饰器

### 自己实现一个@Body装饰器

```ts
import {
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';
const CustomBody = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    console.log('data', data);
    return ctx.switchToHttp().getRequest().body;
  },
);

  @Get('/list')
  async getInfoList(@CustomBody('sens') body) {
    console.log('body: ', body);
    return body;
  }
```
### 实现一个@Headers装饰器

```ts
// @CustomHeaders
const CustomHeaders = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const headers = ctx.switchToHttp().getRequest().headers;
    if (!key) {
      return headers;
    } else {
      return headers[key];
    }
  },
);
```

### 实现一个@Query装饰器

通过给装饰器传递一个ParseIntPipe类的实例，可以将返回值转换成number类型

```ts
// @CustomQuery
const CustomQuery = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const query = ctx.switchToHttp().getRequest().query;
    return key ? query[key] : query;
  },
);
// 支持
  async getInfoList(@CustomQuery('a', new ParseIntPipe()) query) {
    console.log('query: ', typeof query);
    return query;
  }

```

## class装饰器

```ts
const Ddd = () => Controller();
@Ddd()
export class AppController {}
// 上面代码等同于

@Controller()
export class AppController {}

```

还可以组合多个装饰器

