import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { PrismaModule } from './prisma/prisma.module';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.development' : '.env',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production').required(),
        PORT: Joi.string().valid('3000', '5000').required(),
        BACKEND_URL: Joi.string().required(),
        FRONTEND_URL: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
      }),
    }),
    UsersModule,
    CommonModule,
  ],
  providers: [],
})
export class AppModule {}
