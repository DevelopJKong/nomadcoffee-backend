import { DynamicModule, Global, Module } from '@nestjs/common';
import { LoggerModuleOptions } from './logger.interface';
import { LoggerService } from './logger.service';
import { CONFIG_OPTIONS } from '../../common/common.constant';

@Global()
@Module({})
export class LoggerModule {
  static forRoot(options: LoggerModuleOptions): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        LoggerService,
      ],
      exports: [LoggerService],
    };
  }
}
