import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import {
  CorsConfig,
  NestConfig,
  SwaggerConfig,
} from './configuration/config.interface';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import * as tz from 'dayjs/plugin/timezone';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
    // new PaginationQueryPipeTransform(),
  );

  app.use(cookieParser());
  app.use(helmet());
  // app.use(compression());

  // enable shutdown hook
  app.enableShutdownHooks();

  const configService = app.get(ConfigService);

  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');

  // Global Prefix
  app.setGlobalPrefix(nestConfig.path);

  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(swaggerConfig.version)
      // .addApiKey({ type: 'apiKey', name: 'X-API-KEY', in: 'header' }, 'Api-Key')
      .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(swaggerConfig.path || 'api', app, document);
  }

  // Cors
  if (corsConfig.enabled) {
    app.enableCors({
      origin: corsConfig.origins,
      credentials: true,
    });
  }

  dayjs.extend(tz);
  dayjs.tz.setDefault('Asia/Ho_Chi_Minh');

  await app.listen(nestConfig.port, () => {
    console.log(
      `Server running port: ${nestConfig.port}`,
      `🚀 API server listenning on http://localhost:${nestConfig.port}/api`,
    );
  });
}
bootstrap();
