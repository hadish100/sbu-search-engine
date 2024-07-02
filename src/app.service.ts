import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class app_service 
{
  constructor
  (
    private readonly config_service: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  uid() : number
  {
    return Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000;
  }

  get_now() : number
  {
    return Math.floor(Date.now() / 1000);
  }

  async set_key(key: string, value: string) : Promise<void>
  {
    await this.redis.set(key, value);
  }

  async get_key(key: string) : Promise<string>
  {
    return await this.redis.get(key);
  }


}
