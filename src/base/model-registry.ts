import { $ModelId, ModelId, ModelName, ModelVersion } from "./meta";
import { AnyDomainModel, DomainModelClass } from "./model";

export class ModelVersions<
  T extends AnyDomainModel = AnyDomainModel
> extends Map<ModelVersion, DomainModelClass<T>> {
  constructor(public readonly modelName: ModelName) {
    super();
  }
}

export class ModelStore<T extends AnyDomainModel = AnyDomainModel> extends Map<
  ModelName,
  ModelVersions<T>
> {}

export class ModelRegistry {
  private store: ModelStore = new ModelStore();

  getModelVersions<T extends AnyDomainModel = AnyDomainModel>(
    modelName: ModelName
  ) {
    const current = () =>
      this.store.get(modelName) as ModelVersions<T> | undefined;

    if (!current()) this.store.set(modelName, new ModelVersions(modelName));

    return current()!;
  }

  private resolveModelId(
    p1: ModelName | DomainModelClass,
    p2?: ModelVersion
  ): $ModelId {
    if (typeof p1 === "string") {
      return new $ModelId(p1, p2 as ModelVersion);
    }

    return $ModelId.fromValue(p1.modelDescriptor().modelId);
  }

  getModel<T extends AnyDomainModel = AnyDomainModel>(
    modelName: ModelName,
    modelVersion: ModelVersion = 0
  ) {
    const versions = this.getModelVersions<T>(modelName);

    return versions.get(modelVersion);
  }

  getModelByModelId<T extends AnyDomainModel = AnyDomainModel>(
    modelId: ModelId
  ) {
    const { modelName, modelVersion } = $ModelId.fromValue(modelId);

    return this.getModel<T>(modelName, modelVersion);
  }

  hasRegisteredModel(
    p1: ModelName | DomainModelClass,
    p2?: ModelVersion
  ): boolean {
    const { modelName, modelVersion } = this.resolveModelId(p1, p2);

    return Boolean(this.getModel(modelName, modelVersion));
  }

  hasRegisteredModelWithId(modelId: ModelId) {
    const { modelName, modelVersion } = $ModelId.fromValue(modelId);

    return Boolean(this.getModel(modelName, modelVersion));
  }

  registerModel(modelClass: DomainModelClass) {
    const modelName = modelClass.modelDescriptor().modelName;
    const modelVersion = modelClass.modelDescriptor().modelVersion;

    if (this.hasRegisteredModel(modelName, modelVersion))
      throw new Error(
        `Cannot register: Model ${modelName} with version ${modelVersion} is already registered.`
      );

    const versions = this.getModelVersions(modelName);

    versions.set(modelVersion, modelClass);

    return this;
  }

  deregisterModel(p1: ModelName | DomainModelClass, p2?: ModelVersion) {
    const { modelName, modelVersion } = this.resolveModelId(p1, p2);

    if (!this.hasRegisteredModel(modelName, modelVersion)) return;

    const versions = this.getModelVersions(modelName);

    versions.delete(modelVersion);
  }

  clearModelVersions(modelName: ModelName) {
    this.store.delete(modelName);
  }

  clearAll() {
    this.store = new ModelStore();
  }
}
