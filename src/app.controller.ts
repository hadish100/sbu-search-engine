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

  @Get('search_student_by_id_or_name_from_cache')
  async search_student_by_id_or_name_from_cache(@Query('search') search: string)
  {
    return await this.app_service.search_student_by_id_or_name_from_cache(search);
  }

  @Get('search_student_by_id_or_name_from_db')
  async search_student_by_id_or_name_from_db(@Query('search') search: string)
  {
    return await this.app_service.search_student_by_id_or_name_from_db(search);
  }

  @Get('get_student_profile')
  async get_student_profile(@Query('id') id: string)
  {
    return await this.app_service.get_student_profile(id);
  }

}
