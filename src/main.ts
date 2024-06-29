import { NestFactory } from '@nestjs/core';
import { app_module } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';
import { join } from 'path';

async function bootstrap() 
{
  const app = await NestFactory.create<NestExpressApplication>(app_module);

  app.useStaticAssets(join(__dirname, '..', 'src', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src', 'views'));
  app.setViewEngine('hbs');


  const options = new DocumentBuilder()
  .setTitle('SBU SEARCH ENGINE API DOCS')
  .setVersion('1.0')
  .build();

  const swagger_css = fs.readFileSync('src/swagger.css','utf8');
  const document = SwaggerModule.createDocument(app, options); 
  SwaggerModule.setup('/docs', app, document,
  {
    customSiteTitle: 'SBU SEARCH ENGINE DOCS',
    customCss: swagger_css,
    swaggerOptions:{defaultModelsExpandDepth: -1}
  });


  await app.listen(3000,'0.0.0.0');
}

bootstrap();
