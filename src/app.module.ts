import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { PrismaModule } from './prisma/prisma.module';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { LoggerModule } from './libs/logger/logger.module';
import { JwtModule } from './libs/jwt/jwt.module';
import { UploadsModule } from './libs/uploads/uploads.module';
import { AuthModule } from './libs/auth/auth.module';
import { DEV, PROD } from './common/common.constant';

const TOKEN_KEY = 'x-jwt' as const;
@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === DEV ? '.env.development' : '.env',
      ignoreEnvFile: process.env.NODE_ENV === PROD,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid(DEV, PROD).required(),
        PORT: Joi.string().valid('3000', '5000').required(),
        BACKEND_URL: Joi.string().required(),
        FRONTEND_URL: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
        SALT_ROUNDS: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_BUCKET_NAME: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      fieldResolverEnhancers: ['interceptors'],
      installSubscriptionHandlers: true,
      driver: ApolloDriver,
      autoSchemaFile: true,
      subscriptions: {
        'subscriptions-transport-ws': {
          onConnect: (connectionParams: { [TOKEN_KEY]: string }) => {
            const { [TOKEN_KEY]: token } = connectionParams;
            if (!token) throw new Error('Missing auth token!');
            return {
              token: connectionParams[TOKEN_KEY],
            };
          },
        },
      },
      context: ({ req }) => {
        return {
          token: req.headers[TOKEN_KEY],
        };
      },
    }),
    LoggerModule.forRoot({
      nodeEnv: process.env.NODE_ENV,
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    UploadsModule.forRoot({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucketName: process.env.AWS_BUCKET_NAME,
    }),
    AuthModule,
    UsersModule,
    CommonModule,
    UploadsModule,
  ],
  providers: [],
})
export class AppModule {}
