import { Class } from "type-fest";
import { AnyDomainModel, DomainModelClass, InferredProps } from ".";
import {
  ModelId,
  ModelName,
  ModelPropertyAccessorMap,
  ModelPropsValidator,
  ModelStaticValuesMap,
  ModelVersion,
  getDeclaredPropertyAccessors,
  getModelDomain,
  getModelId,
  getModelMutable,
  getModelName,
  getModelPropsType,
  getModelPropsValidators,
  getModelVersion,
  getOwnModelPropsValidator,
  getOwnModelStaticValues,
  getResolvedPropertyAccessors,
} from "../meta";

export class ModelDescriptor<T extends AnyDomainModel = AnyDomainModel> {
  constructor(public readonly modelClass: DomainModelClass<T>) {}

  get modelDomain() {
    return getModelDomain(this.modelClass);
  }

  get modelMutable() {
    return getModelMutable(this.modelClass) ?? false;
  }

  get modelName(): ModelName {
    return getModelName(this.modelClass);
  }

  get modelVersion(): ModelVersion {
    return getModelVersion(this.modelClass);
  }

  get modelId(): ModelId {
    return getModelId(this.modelClass);
  }

  get ownModelPropsValidator(): ModelPropsValidator<T> | undefined {
    return getOwnModelPropsValidator<T>(this.modelClass);
  }

  get modelPropsValidators(): ModelPropsValidator[] {
    return getModelPropsValidators(this.modelClass);
  }

  get ownModelStaticValues(): ModelStaticValuesMap<T> {
    return getOwnModelStaticValues<T>(this.modelClass);
  }

  get declaredPropertyAccessors(): ModelPropertyAccessorMap<T> {
    return getDeclaredPropertyAccessors<T>(this.modelClass.prototype);
  }

  get resolvedPropertyAccessors(): ModelPropertyAccessorMap<T> {
    return getResolvedPropertyAccessors<T>(this.modelClass.prototype);
  }

  get propsType(): Class<InferredProps<T>> | undefined {
    return getModelPropsType(this.modelClass);
  }
}
