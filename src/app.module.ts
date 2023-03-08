import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { PrismaModule } from './prisma/prisma.module';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';

const TOKEN_KEY = 'x-jwt' as const;
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
        SALT_ROUNDS: Joi.string().required(),
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
    UsersModule,
    CommonModule,
  ],
  providers: [],
})
export class AppModule {}
