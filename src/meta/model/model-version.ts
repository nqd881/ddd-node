import { AnyModel, ModelClass } from "../../core";

export type ModelVersion = number;

export class MVersion extends Number {
  static validate(modelVersion: ModelVersion) {
    if (modelVersion < 0 && Number.isInteger(modelVersion))
      throw new Error("Model version must be a non-negative integer number");
  }

  constructor(modelVersion: ModelVersion) {
    MVersion.validate(modelVersion);

    super(modelVersion);
  }
}

const ModelVersionMetaKey = Symbol.for("MODEL_VERSION");

export const defineModelVersion = <T extends AnyModel>(
  target: ModelClass<T>,
  modelVersion: ModelVersion
) => {
  Reflect.defineMetadata(
    ModelVersionMetaKey,
    new MVersion(modelVersion),
    target
  );
};

export const getModelVersion = <T extends AnyModel>(
  target: ModelClass<T>
): ModelVersion => {
  if (!Reflect.hasOwnMetadata(ModelVersionMetaKey, target))
    defineModelVersion(target, 0);

  return Reflect.getOwnMetadata<MVersion>(
    ModelVersionMetaKey,
    target
  )!.valueOf();
};
