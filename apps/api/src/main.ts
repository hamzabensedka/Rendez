import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger as PinoLogger } from 'nestjs-pino';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { envSchema } from './env.validation';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

envSchema.validate();

const DEV_WEB_ORIGINS = [
  'http://localhost:8081',
  'http://127.0.0.1:8081',
  'http://localhost:19006',
  'http://127.0.0.1:19006',
  'http://localhost:8082',
  'http://localhost:19000',
];

function originsFromEnv(): string[] {
  return (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}

function isLocalDevOrigin(origin: string): boolean {
  try {
    const { hostname } = new URL(origin);
    return hostname === 'localhost' || hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

function corsOrigin(
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void
) {
  if (!origin) {
    callback(null, true);
    return;
  }

  const allowed = new Set([...DEV_WEB_ORIGINS, ...originsFromEnv()]);
  if (allowed.has(origin)) {
    callback(null, true);
    return;
  }

  if (process.env.NODE_ENV !== 'production' && isLocalDevOrigin(origin)) {
    callback(null, true);
    return;
  }

  callback(null, false);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(PinoLogger));
  const logger = app.get(PinoLogger);

  app.use(
    helmet({
      // Browser clients (Expo web) call this API from another origin.
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );
  app.setGlobalPrefix('v1');
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Planity API')
      .setDescription('Booking marketplace API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`API listening on port ${port} (prefix /v1)`);
  if (process.env.NODE_ENV !== 'production') {
    logger.log(`Swagger UI at http://localhost:${port}/api`);
  }
}
bootstrap();
