import { ModelName, ModelVersion } from "../meta";
import { AnyModel, ModelClass } from "./model";

export class ModelVersionRegistry<T extends AnyModel = AnyModel> extends Map<
  ModelVersion,
  ModelClass<T>
> {}

export class ModelRegistry<T extends AnyModel = AnyModel> extends Map<
  ModelName,
  ModelVersionRegistry<T>
> {}

export type DomainName = string;

export class Domain {
  readonly name: DomainName;
  private readonly modelRegistry: ModelRegistry = new ModelRegistry();

  constructor(name: DomainName) {
    this.name = name;
  }

  getModelVersionRegistry(modelName: ModelName) {
    const modelVersionRegistry = () => this.modelRegistry.get(modelName);

    if (!modelVersionRegistry())
      this.modelRegistry.set(modelName, new ModelVersionRegistry());

    return modelVersionRegistry()!;
  }

  getModel(modelName: ModelName, modelVersion: ModelVersion = 0) {
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

    return Boolean(this.getModel(modelName, modelVersion));
  }

  registerModel(modelClass: ModelClass) {
    const modelName = modelClass.modelName();
    const modelVersion = modelClass.modelVersion();

    if (this.hasRegisteredModel(modelName, modelVersion))
      throw new Error(
        `Model ${modelName} with version ${modelVersion} has been registered`
      );

    const modelVersionRegistry = this.getModelVersionRegistry(modelName);

    modelVersionRegistry.set(modelVersion, modelClass);

    return this;
  }
}
