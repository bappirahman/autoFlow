import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './lib/auth';
import { DbModule } from './db/db.module';

@Module({
  imports: [AuthModule.forRoot({ auth }), DbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
