import { AnyModel, ModelClass } from "./core";
import { $ModelId, ModelId, ModelName, ModelVersion } from "./meta";

export class ModelVersionMap<T extends AnyModel = AnyModel> extends Map<
  ModelVersion,
  ModelClass<T>
> {
  constructor(public readonly modelName: ModelName) {
    super();
  }
}

export class ModelMap<T extends AnyModel = AnyModel> extends Map<
  ModelName,
  ModelVersionMap<T>
> {}

export class ModelRegistry {
  private readonly modelMap: ModelMap = new ModelMap();

  getModelVersionMap<T extends AnyModel = AnyModel>(modelName: ModelName) {
    const modelVersionMap = () =>
      this.modelMap.get(modelName) as ModelVersionMap<T> | undefined;

    if (!modelVersionMap())
      this.modelMap.set(modelName, new ModelVersionMap(modelName));

    return modelVersionMap()!;
  }

  getModel<T extends AnyModel = AnyModel>(
    modelName: ModelName,
    modelVersion: ModelVersion = 0
  ): ModelClass<T> | undefined {
    const modelVersionMap = this.getModelVersionMap<T>(modelName);

    return modelVersionMap.get(modelVersion);
  }

  getModelByModelId<T extends AnyModel = AnyModel>(modelId: ModelId) {
    const { modelName, modelVersion } = $ModelId.fromValue(modelId);

    return this.getModel<T>(modelName, modelVersion);
  }

  hasRegisteredModel(modelName: ModelName, modelVersion: ModelVersion): boolean;
  hasRegisteredModel(model: ModelClass): boolean;
  hasRegisteredModel(p1: ModelName | ModelClass, p2?: ModelVersion): boolean {
    let modelName: ModelName, modelVersion: ModelVersion;

    if (typeof p1 === "string") {
      modelName = p1;
      modelVersion = p2 as ModelVersion;
    } else {
      modelName = p1.modelName();
      modelVersion = p1.modelVersion();
    }

    return Boolean(this.getModel(modelName, modelVersion));
  }

  registerModel(modelClass: ModelClass) {
    const modelName = modelClass.modelName();
    const modelVersion = modelClass.modelVersion();

    if (this.hasRegisteredModel(modelName, modelVersion))
      throw new Error(
        `Model ${modelName} with version ${modelVersion} has been registered`
      );

    const modelVersionMap = this.getModelVersionMap(modelName);

    modelVersionMap.set(modelVersion, modelClass);

    return this;
  }
}
