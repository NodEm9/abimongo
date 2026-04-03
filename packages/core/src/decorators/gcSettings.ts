import 'reflect-metadata';
import { AbimongoModelOptions } from '../types';

export const GC_SETTINGS_KEY = Symbol('gc:settings');

export interface GCConfig extends AbimongoModelOptions<any> {}

/**
 * 
 * @param config 
 * @returns 
 * @example
 * ```ts
 * @GCSettings({ ttl: 3600 }) // 1 hour TTL
 * class MyEntity {}
 * ```
 */
export function GCSettings(config: GCConfig): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata(GC_SETTINGS_KEY, config, target);
  };
}

export function getGCSettings(target: any): GCConfig | undefined {
  const gcSettings = Reflect.getMetadata(GC_SETTINGS_KEY, target) as GCConfig | undefined;
  return gcSettings;
}
