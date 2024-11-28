import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './user/entities/user.entity';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const jwtServiceReflector = app.get<JwtService>(JwtService);
  // const refReflector = app.get<Reflector>(Reflector);
  // // @InjectRepository(User)
  // // private usesRepository: Repository<User>,
  // const usesRepository = app.get<Repository<User>>(Repository);
  // app.useGlobalGuards(
  //   new AuthGuard(jwtServiceReflector, refReflector, usesRepository),
  // );
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Test example')
    .setDescription('The Api description')
    .setVersion('1.0')
    .addTag('test')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
