import { AbimongoSchema } from "../core";

/**
 * Represents a plugin for extending Abimongo functionality.
 */
export interface AbimongoPlugin {
  /**
   * The name of the plugin.
   */
  name: string;

  /**
   * The initialization function for the plugin.
   * @param {AbimongoSchema<any>} schema - The schema to initialize the plugin with.
   */
  init: (schema: AbimongoSchema<any>) => void;
}
