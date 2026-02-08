import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: process.env.CORS_URL || 'http://localhost:3001',
    credentials: true,
  });
  console.log(`CORS enabled for: ${process.env.CORS_URL}`);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
