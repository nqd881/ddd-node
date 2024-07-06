import { AnyModel, ModelClass } from "../core";

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

const ModelNameMetaKey = Symbol.for("MODEL_NAME");

export const defineModelName = <T extends AnyModel>(
  target: ModelClass<T>,
  modelName: ModelName
) => {
  Reflect.defineMetadata(ModelNameMetaKey, new $ModelName(modelName), target);
};

export const getModelName = <T extends AnyModel>(
  target: ModelClass<T>
): ModelName => {
  if (!Reflect.hasOwnMetadata(ModelNameMetaKey, target))
    defineModelName(target, target.name);

  return Reflect.getOwnMetadata<$ModelName>(
    ModelNameMetaKey,
    target
  )!.valueOf();
};
