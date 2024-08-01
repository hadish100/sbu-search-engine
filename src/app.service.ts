import { HttpException, HttpStatus, Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class app_service extends PrismaClient implements OnModuleInit, OnModuleDestroy
{
  constructor
  (
    private readonly config_service: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {super()}

  async onModuleInit() 
  {
    console.log(">>> connecting to database");
    await this.$connect();
    console.log(">>> initializing prisma data");
    // await this.init_prisma_data();
    console.log(">>> initializing redis cache");
    // await this.init_redis_cache();
    console.log(">>> app service is ready");
  }

  async onModuleDestroy() 
  {
    await this.$disconnect();
  }

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

  async init_prisma_data() : Promise<void>
  {
    var file_path = path.join(__dirname, '..','src/data/people.json');
    const data = JSON.parse(await fs.readFile(file_path, 'utf-8'));

    await this.student.deleteMany();

    await this.student.createMany
    ({
      data: data.map(student => 
      {
        return {name: student.name, studentId: student.student_id}
      })
    });

    const allStudents = await this.student.findMany({
      where: 
      {
        studentId: 
        {
          in: data.map(student => student.student_id),
        },
      },
      select: 
      {
        id: true,
        studentId: true,
      },
    });

    const studentIdMap = allStudents.reduce((map, student) => 
    {
      map[student.studentId] = student.id;
      return map;
    }, {});
    
    const partnerships = [];
    data.forEach(student => 
    {
      if(!student.partners) return;
      student.partners.forEach(partnerId => {
        const studentAId = studentIdMap[student.student_id];
        const studentBId = studentIdMap[partnerId];
    
        if (studentAId && studentBId && !partnerships.find(p => p.studentAId === studentBId && p.studentBId === studentAId)) 
        {
          partnerships.push
          ({
            studentAId,
            studentBId,
          });
        }
      });
    });
    
    await this.partnership.createMany
    ({
      data: partnerships,
      skipDuplicates: true,
    });



  }

  async init_redis_cache() : Promise<void>
  {
    const students = await this.student.findMany();
    await this.redis.mset(students.map(student => {return [student.studentId, student.name]}).flat());
  }

  async search_student_by_id_or_name_from_cache(search: string)
  {
    console.time("search_student_by_id_or_name_from_cache");
    var keys;
    var values;

    if(parseInt(search))
    {
      keys = await this.redis.keys(`*${search}*`);
      values = await this.redis.mget(keys);
    }

    else
    {
      keys = await this.redis.keys('*');
      values = await this.redis.mget(keys);
      keys = keys.filter((key, index) => {return values[index].includes(search)});
      values = values.filter((value) => {return value.includes(search)});
    }
    

    const students = [];
    for(let i = 0; i < keys.length; i++) students.push({studentId: keys[i], name: values[i]});
    console.timeEnd("search_student_by_id_or_name_from_cache");
    return students;
  }

  async search_student_by_id_or_name_from_db(search: string)
  {
    console.time("search_student_by_id_or_name_from_db");
    var students = await this.student.findMany
    ({
      where: 
      {
        OR: 
        [
          {studentId: {contains: search}},
          {name: {contains: search}}
        ]
      }
    })
    console.timeEnd("search_student_by_id_or_name_from_db");

    return students.map(student => {return {studentId: student.studentId, name: student.name}});
  }

  async get_student_profile(student_id: string)
  {
    var student = await this.student.findUnique
    ({
      where: {studentId: student_id}
    });

    return student;
  }


  async test()
  {
    return await this.student.findMany({
      where: {
        OR: [
          {
            partnershipsA: {
              some: {},
            },
          },
          {
            partnershipsB: {
              some: {},
            },
          },
        ],
      },
      include: {
        partnershipsA: true,
        partnershipsB: true,
      },
    })
  }


}
