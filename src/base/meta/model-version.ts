import { AnyModel, ModelClass } from "../model";

export type ModelVersion = number;

export class $ModelVersion extends Number {
  static validate(modelVersion: ModelVersion) {
    if (modelVersion < 0 && Number.isInteger(modelVersion))
      throw new Error("Model version must be a non-negative integer number");
  }

  constructor(modelVersion: ModelVersion) {
    $ModelVersion.validate(modelVersion);

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
    new $ModelVersion(modelVersion),
    target
  );
};

export const getModelVersion = <T extends AnyModel>(
  target: ModelClass<T>
): ModelVersion => {
  if (!Reflect.hasOwnMetadata(ModelVersionMetaKey, target))
    defineModelVersion(target, 0);

  return Reflect.getOwnMetadata<$ModelVersion>(
    ModelVersionMetaKey,
    target
  )!.valueOf();
};
