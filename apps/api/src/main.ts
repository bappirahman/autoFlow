import './instrument';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { setApp } from './app-ref';
import { serve } from 'inngest/express';
import express from 'express';
import { inngest } from './lib/inngest/client';
import { functions } from './lib/inngest/functions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  setApp(app);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );
  app.enableCors({
    origin: process.env.CORS_URL || 'http://localhost:3001',
    credentials: true,
  });
  app.use('/api/auth/webhooks/polar', express.raw({ type: '*/*' }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/inngest', express.json({ type: '*/*' }));
  app.use('/api/webhooks', express.json());
  app.use('/api/inngest', serve({ client: inngest, functions }));
  console.log(`CORS enabled for: ${process.env.CORS_URL}`);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
