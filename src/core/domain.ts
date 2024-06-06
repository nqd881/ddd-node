import { AnyModel, ModelClass } from "./model";

type ModelName = string;
type ModelVersion = number;

export class ModelVersionRegistry<T extends AnyModel = AnyModel> extends Map<
  ModelVersion,
  ModelClass<T>
> {}

export class ModelRegistry<T extends AnyModel = AnyModel> extends Map<
  ModelName,
  ModelVersionRegistry<T>
> {}

export class Domain {
  private modelRegistry: ModelRegistry = new ModelRegistry();

  constructor(models?: ModelClass[]) {
    if (models) {
      models.forEach((model) => this.registerModel(model));
    }
  }

  getModelVersionRegistry(modelName: ModelName) {
    const modelVersionRegistry = () => this.modelRegistry.get(modelName);

    if (!modelVersionRegistry())
      this.modelRegistry.set(modelName, new ModelVersionRegistry());

    return modelVersionRegistry()!;
  }

  getRegisteredModel(modelName: ModelName, modelVersion: ModelVersion = 0) {
    const modelVersionRegistry = this.getModelVersionRegistry(modelName);

    return modelVersionRegistry.get(modelVersion);
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

    return Boolean(this.getRegisteredModel(modelName, modelVersion));
  }

  registerModel(modelClass: ModelClass) {
    const modelName = modelClass.modelName();
    const modelVersion = modelClass.modelVersion();

    if (this.hasRegisteredModel(modelName, modelVersion))
      throw new Error(
        `Model ${modelName} with version ${modelVersion} has been registered`
      );

    const versionRegistry = this.getModelVersionRegistry(modelName);

    versionRegistry.set(modelVersion, modelClass);

    return this;
  }
}
