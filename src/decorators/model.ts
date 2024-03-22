import {
  ModelClass,
  ModelRegistry,
  ModelTypePattern,
  defineModelType,
} from "#core";

export const model = (type: ModelTypePattern) => {
  return <T extends ModelClass>(target: T) => {
    ModelRegistry.instance().registerModel(type, target);

    defineModelType(target.prototype, type);
  };
};
