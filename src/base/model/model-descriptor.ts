import { AnyDomainModel, DomainModelClass } from ".";
import {
  ModelId,
  ModelName,
  ModelPropsMap,
  ModelPropsValidator,
  ModelStaticValuesMap,
  ModelVersion,
  getModelDomain,
  getModelId,
  getModelMutable,
  getModelName,
  getModelPropsMap,
  getModelPropsValidators,
  getModelVersion,
  getOwnModelPropsMap,
  getOwnModelPropsValidator,
  getOwnModelStaticValues,
} from "../meta";

export class ModelDescriptor<T extends AnyDomainModel = AnyDomainModel> {
  constructor(public readonly modelClass: DomainModelClass<T>) {}

  modelDomain() {
    return getModelDomain(this.modelClass);
  }

  modelMutable() {
    return getModelMutable(this.modelClass) ?? false;
  }

  modelName(): ModelName {
    return getModelName(this.modelClass);
  }

  modelVersion(): ModelVersion {
    return getModelVersion(this.modelClass);
  }

  modelId(): ModelId {
    return getModelId(this.modelClass);
  }

  ownModelPropsValidator(): ModelPropsValidator<T> | undefined {
    return getOwnModelPropsValidator<T>(this.modelClass);
  }

  modelPropsValidators(): ModelPropsValidator[] {
    return getModelPropsValidators(this.modelClass);
  }

  ownModelStaticValues(): ModelStaticValuesMap<T> {
    return getOwnModelStaticValues<T>(this.modelClass);
  }

  ownModelPropsMap(): ModelPropsMap<T> {
    return getOwnModelPropsMap<T>(this.modelClass.prototype);
  }

  modelPropsMap(): ModelPropsMap<T> {
    return getModelPropsMap<T>(this.modelClass.prototype);
  }
}
