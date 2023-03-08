import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import * as fs from 'fs';
import * as express from 'express';
import { join } from 'path';
import { BACKEND_URL, fileFolder, PORT } from './common/common.constant';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV === 'development') {
    if (!fs.existsSync(fileFolder)) fs.mkdirSync(fileFolder);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));
  app.use('/files', express.static(join(__dirname, '../files')));
  app.enableCors();

  const start = () => console.log(`Server Start! ${BACKEND_URL}`);
  await app.listen(PORT, start);
}
bootstrap();
