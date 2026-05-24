import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { envSchema } from './env.validation';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

// Fail fast if required env vars are missing or invalid
envSchema.validate();

function parseAllowedOrigins(): string[] {
  const raw = process.env.ALLOWED_ORIGINS;
  if (!raw || raw.trim() === '') {
    return ['http://localhost:19006'];
  }
  return raw
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  app.use(helmet());

  // Global prefix
  app.setGlobalPrefix('v1');

  app.useGlobalFilters(new GlobalExceptionFilter());

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // CORS
  app.enableCors({
    origin: parseAllowedOrigins(),
    credentials: true,
  });

  // Swagger (non-production only)
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
  const logger = app.get(Logger);
  logger.log(`API listening on port ${port} (prefix /v1)`);
  if (process.env.NODE_ENV !== 'production') {
    logger.log(`Swagger UI at http://localhost:${port}/api`);
  }
}

bootstrap();

