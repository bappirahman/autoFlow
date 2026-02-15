import './instrument';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { serve } from 'inngest/express';
import express from 'express';
import { inngest, functions } from './lib/inngest/client';

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
  app.use('/api/inngest', express.json({ type: '*/*' }));
  app.use('api/auth/webhooks/polar', express.raw({ type: '*/*' }));
  app.use('/api/inngest', serve({ client: inngest, functions }));
  console.log(`CORS enabled for: ${process.env.CORS_URL}`);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
