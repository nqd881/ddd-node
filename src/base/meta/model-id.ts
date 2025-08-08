import { AnyDomainModel, DomainModelClass } from "../model";
import { ModelName, getModelName } from "./model-name";
import { ModelVersion, getModelVersion } from "./model-version";

export type ModelId = string;

export type ModelIdFormat = `${string}${typeof $ModelId.Divider}${number}`;

export class $ModelId extends String {
  static Divider = "|" as const;

  static Format = new RegExp(/^.+\|[0-9]+$/);

  static fromValue(value: ModelId) {
    if (!this.Format.test(value))
      throw new Error(`Cannot parse $ModelId from value ${value}`);

    const [modelName, modelVersion] = value.split(this.Divider);

    return new $ModelId(modelName, Number(modelVersion));
  }

  static makeValue(modelName: ModelName, modelVersion: ModelVersion): ModelId {
    const modelId: ModelIdFormat = `${modelName}${this.Divider}${modelVersion}`;

    return modelId;
  }

  constructor(
    public readonly modelName: ModelName,
    public readonly modelVersion: ModelVersion
  ) {
    super($ModelId.makeValue(modelName, modelVersion));
  }
}

const ModelIdMetaKey = Symbol.for("MODEL_ID");

export const setModelId = <T extends AnyDomainModel>(
  target: DomainModelClass<T>,
  modelId: $ModelId
) => {
  Reflect.defineMetadata(ModelIdMetaKey, modelId, target);
};

export const getModelId = <T extends AnyDomainModel>(
  target: DomainModelClass<T>
): ModelId => {
  if (!Reflect.hasOwnMetadata(ModelIdMetaKey, target)) {
    const modelName = getModelName(target);
    const modelVersion = getModelVersion(target);

    setModelId(target, new $ModelId(modelName, modelVersion));
  }

  return Reflect.getOwnMetadata<$ModelId>(ModelIdMetaKey, target)!.valueOf();
};
