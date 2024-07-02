import { Module } from '@nestjs/common';
import { app_controller } from './app.controller';
import { app_service } from './app.service';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module
({
  imports: 
  [
    ConfigModule.forRoot
    ({
      isGlobal: true,
      envFilePath: ".env",
    }),

    RedisModule.forRoot
    ({
      type: 'single',
      url:"redis://root:mahdi2020@65.109.186.13:6379",
    }),
],

  controllers: [app_controller],
  providers: [app_service],
})

export class app_module {}
