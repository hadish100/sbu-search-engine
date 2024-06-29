import { Module } from '@nestjs/common';
import { app_controller } from './app.controller';
import { app_service } from './app.service';
import { ConfigModule,ConfigService } from '@nestjs/config';

@Module
({
  imports: 
  [
    ConfigModule.forRoot
    ({
      isGlobal: true,
      envFilePath: ".env",
    }),
  ],

  controllers: [app_controller],
  providers: [app_service],
})

export class app_module {}
