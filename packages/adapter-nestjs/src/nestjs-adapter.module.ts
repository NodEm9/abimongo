import {
  DynamicModule,
  Module,
  Provider
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ABIMONGO_ADAPTER_OPTIONS } from './nestjs-adapter.constants.js';
import { AbimongoNestInterceptor } from './nestjs-adapter.interceptor.js';
import type { NestjsAbimongoAdapterOptions } from './nestjs-adapter.types.js';

@Module({})
export class AbimongoNestAdapterModule {
  static forRoot(options: NestjsAbimongoAdapterOptions = {}): DynamicModule {
    const optionsProvider: Provider = {
      provide: ABIMONGO_ADAPTER_OPTIONS,
      useValue: options
    };

    const interceptorProvider: Provider = {
      provide: APP_INTERCEPTOR,
      useClass: AbimongoNestInterceptor
    };

    return {
      module: AbimongoNestAdapterModule,
      providers: [
        optionsProvider,
        interceptorProvider
      ],
      exports: [optionsProvider]
    };
  }
}