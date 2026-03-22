import { DynamicModule, Module } from "@nestjs/common";
import { ABIMONGO_TENANCY_OPTIONS } from "./constants";
import type { TenancyOptions } from "@abimongo/adapter-types";
import { AbimongoTenancyInterceptor } from "./abimongo-tenancy.interceptor";

@Module({})
export class AbimongoNextjsTenancyModule {
  static forRoot(options: TenancyOptions = {}): DynamicModule {
    return {
      module: AbimongoNextjsTenancyModule,
      providers: [
        {
          provide: ABIMONGO_TENANCY_OPTIONS,
          useValue: options
        },
        AbimongoTenancyInterceptor
      ],
      exports: [AbimongoTenancyInterceptor]
    };
  }
}
