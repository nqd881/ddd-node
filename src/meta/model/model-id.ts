import { AnyModel, ModelClass } from "../../core";
import { ModelName, getModelName } from "./model-name";
import { ModelVersion, getModelVersion } from "./model-version";

export type ModelId = string;

export type MIdFormat = `${string}${typeof MId.Divider}${number}`;

export class MId extends String {
  static Divider = "|" as const;

  static Format = new RegExp(/^.+\|[0-9]+$/);

  static fromValue(value: ModelId) {
    if (!this.Format.test(value))
      throw new Error(`Cannot parse MId from value ${value}`);

    const [modelName, modelVersion] = value.split(this.Divider);

    return new MId(modelName, Number(modelVersion));
  }

  static makeValue(modelName: ModelName, modelVersion: ModelVersion): ModelId {
    const modelId: MIdFormat = `${modelName}${this.Divider}${modelVersion}`;

    return modelId;
  }

  constructor(
    public readonly modelName: ModelName,
    public readonly modelVersion: ModelVersion
  ) {
    super(MId.makeValue(modelName, modelVersion));
  }
}

const ModelIdMetaKey = Symbol.for("MODEL_ID");

export const setModelId = <T extends AnyModel>(
  target: ModelClass<T>,
  modelId: MId
) => {
  Reflect.defineMetadata(ModelIdMetaKey, modelId, target);
};

export const getModelId = <T extends AnyModel>(
  target: ModelClass<T>
): ModelId => {
  if (!Reflect.hasOwnMetadata(ModelIdMetaKey, target)) {
    const modelName = getModelName(target);
    const modelVersion = getModelVersion(target);

    setModelId(target, new MId(modelName, modelVersion));
  }

  return Reflect.getOwnMetadata<MId>(ModelIdMetaKey, target)!.valueOf();
};
