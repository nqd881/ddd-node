import "reflect-metadata";

const ModelMutableMetaKey = Symbol.for("MODEL_MUTABLE");

export const defineModelMutable = (target: object, mutable: boolean) => {
  if (Reflect.hasMetadata(ModelMutableMetaKey, target)) return;

  Reflect.defineMetadata(ModelMutableMetaKey, mutable, target);
};

export const getModelMutable = (target: object) => {
  return Reflect.getMetadata<boolean>(ModelMutableMetaKey, target);
};
