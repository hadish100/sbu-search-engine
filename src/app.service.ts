import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class app_service 
{
  constructor
  (
    private readonly http_service: HttpService,
    private readonly config_service: ConfigService,
  ) {}

  uid()
  {
    return Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000;
  }

  get_now()
  {
    return Math.floor(Date.now() / 1000);
  }


}
