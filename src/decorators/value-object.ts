import { ValueObjectType } from "#core/model-type";
import { ValueObjectClass } from "#core/value-object";
import { model } from "./model";

export const valueObject =
  (name?: string) =>
  <T extends ValueObjectClass>(target: T) => {
    const valueObjectType = new ValueObjectType(name ?? target.name);

    model(valueObjectType.value)(target);
  };
