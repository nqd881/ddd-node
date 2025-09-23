import "reflect-metadata";

const MODEL_MUTABLE = Symbol.for("MODEL_MUTABLE");

export const defineModelMutable = (target: object, mutable: boolean) => {
  if (Reflect.hasMetadata(MODEL_MUTABLE, target)) return;

  Reflect.defineMetadata(MODEL_MUTABLE, mutable, target);
};

export const getModelMutable = (target: object) => {
  return Reflect.getMetadata<boolean>(MODEL_MUTABLE, target);
};
