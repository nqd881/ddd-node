import { AnyDomainModel, DomainModelClass } from "../model";

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

const MODEL_VERSION = Symbol.for("MODEL_VERSION");

export const defineModelVersion = <T extends AnyDomainModel>(
  target: DomainModelClass<T>,
  modelVersion: ModelVersion
) => {
  Reflect.defineMetadata(
    MODEL_VERSION,
    new $ModelVersion(modelVersion),
    target
  );
};

export const getModelVersion = <T extends AnyDomainModel>(
  target: DomainModelClass<T>
): ModelVersion => {
  if (!Reflect.hasOwnMetadata(MODEL_VERSION, target))
    defineModelVersion(target, 0);

  return Reflect.getOwnMetadata<$ModelVersion>(
    MODEL_VERSION,
    target
  )!.valueOf();
};
