import { AnyDomainModel, DomainModelClass } from "../model";

const MODEL_NAME = Symbol.for("MODEL_NAME");

export type ModelName = string;

export class $ModelName extends String {
  static validate(modelName: ModelName) {
    if (modelName.trim().length === 0)
      throw new Error("Model name cannot be an empty string");
  }

  constructor(modelName: ModelName) {
    $ModelName.validate(modelName);

    super(modelName);
  }
}

export const defineModelName = <T extends AnyDomainModel>(
  target: DomainModelClass<T>,
  modelName: ModelName
) => {
  Reflect.defineMetadata(MODEL_NAME, new $ModelName(modelName), target);
};

export const getModelName = <T extends AnyDomainModel>(
  target: DomainModelClass<T>
): ModelName => {
  if (!Reflect.hasOwnMetadata(MODEL_NAME, target))
    defineModelName(target, target.name);

  return Reflect.getOwnMetadata<$ModelName>(MODEL_NAME, target)!.valueOf();
};
