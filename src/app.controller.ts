import { Body, Controller, Get, Param, Post, Query, Render, Res } from '@nestjs/common';
import { app_service } from './app.service';
import { ApiExcludeEndpoint, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HttpStatusCode } from 'axios';
import { InjectRedis } from '@nestjs-modules/ioredis';

@ApiTags('MAIN')
@Controller()

export class app_controller 
{
  constructor(private readonly app_service: app_service) {}

  @ApiOkResponse({description:"test"})
  @Get('test')
  async test()
  {
    return await this.app_service.get_all_students();
  }

}
