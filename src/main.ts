import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import helmet from 'helmet';
import { HttpExceptionFilter } from './http-exception.filter';
import { MyLogger } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'",
          'cdn.jsdelivr.net',
          'maxcdn.bootstrapcdn.com',
          'netdna.bootstrapcdn.com',
          'fonts.googleapis.com',
          'cdnjs.cloudflare.com',
          'febnine.hanrabong.com',
        ],
        scriptSrc: [
          "'self'",
          'code.jquery.com',
          'cdn.jsdelivr.net',
          'netdna.bootstrapcdn.com',
          'ajax.googleapis.com',
          "'sha256-GHn79/tVTUjiWj5V/e7EJkPiydtSFzLpocylRcRRqEk='",
          "'nonce-EDNnf03nceIOfn39fn3e9h3sdfa'",
          'place.map.kakao.com',
          'febnine.hanrabong.com',
        ],
        scriptSrcAttr: ["'self'", "'unsafe-inline'"],
        imgSrc: [
          "'self'",
          'static.hanrabong.com',
          'bootdey.com',
          'www.bootdey.com',
          'validator.swagger.io',
          'place.map.kakao.com',
          'cdn.jsdelivr.net',
          'febnine.hanrabong.com',
        ],
      },
    }),
  );

  app.use(helmet.hidePoweredBy());
  app.use(helmet.xssFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  const logger = app.get<MyLogger>(MyLogger);
  app.useLogger(logger);
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api',
  });

  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
