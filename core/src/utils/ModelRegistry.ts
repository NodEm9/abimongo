import { AbimongoModel } from "../core";
import { Document } from "../types";

const modelRegistry = new Set<AbimongoModel<any>>();

/**
 * AbimongoModelRegistry is a utility to register and manage Abimongo models.
 * It allows you to register models and retrieve all registered models.
 */
export const AbimongoModelRegistry = {
  /**
   * Registers a model in the registry.
   * @param {AbimongoModel<any>} model - The model to register.
   */
  registerModel(model: AbimongoModel<any>) {
    modelRegistry.add(model);
  },

  /**
   * Retrieves a registered model if it exists in the registry.
   * @param {AbimongoModel<any>} model - The model to retrieve.
   * @returns {AbimongoModel<any> | null} The registered model or null if not found.
   */
  getRegisteredModel(model: AbimongoModel<any>) {
    if (modelRegistry.has(model)) {
      return model;
    }
    return null;
  },

  /**
   * Checks if a model is registered.
   * @param {AbimongoModel<any>} model - The model to check.
   * @returns {boolean} True if the model is registered, false otherwise.
   */
  isModelRegistered(model: AbimongoModel<any>): boolean {
    return modelRegistry.has(model);
  },

  /**
   * Unregisters a model from the registry.
   * @param {AbimongoModel<any>} model - The model to unregister.
   */
  unregisterModel(model: AbimongoModel<any>) {
    if (modelRegistry.has(model)) {
      modelRegistry.delete(model);
    }
  },

  /**
   * Retrieves all registered models.
   * @returns {Array<AbimongoModel<any>>} An array of all registered models.
   */
  getAllModels() {
    return [...modelRegistry];
  }
};


const registeredModels: AbimongoModel<any>[] = [];

 function registerModel(model: AbimongoModel<any>) {
  registeredModels.push(model);
}

 function getRegisteredModels(): AbimongoModel<any[]>[] {
  return registeredModels;
}

