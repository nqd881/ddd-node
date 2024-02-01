import { defineModelType } from "#core/metadata";
import { ModelClass } from "#core/model";
import { ModelTypePattern } from "#core/model-type";
import { ModelRegistry } from "#core/registry";

export const model = (type: ModelTypePattern) => {
  return <T extends ModelClass>(target: T) => {
    ModelRegistry.instance().registerModel(type, target);

    defineModelType(target.prototype, type);
  };
};
