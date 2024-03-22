import { ModelClass, ModelTypePattern } from "./model";

export class ModelRegistry {
  private static _instance: ModelRegistry;

  private modelMap: Map<ModelTypePattern, ModelClass>;

  private constructor() {
    this.modelMap = new Map<ModelTypePattern, ModelClass>();
  }

  static instance() {
    if (!this._instance) this._instance = new ModelRegistry();

    return this._instance;
  }

  getMap() {
    return this.modelMap;
  }

  hasModel(type: ModelTypePattern) {
    return this.modelMap.has(type);
  }

  registerModel(type: ModelTypePattern, modelClass: ModelClass) {
    if (this.hasModel(type))
      throw new Error(`Duplicate model for type ${type}`);

    this.modelMap.set(type, modelClass);
  }

  getModel(type: ModelTypePattern) {
    return this.modelMap.get(type);
  }
}
