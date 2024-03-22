import { ValueObjectClass, ValueObjectType } from "#core";
import { model } from "./model";

export const valueObject =
  (name?: string) =>
  <T extends ValueObjectClass>(target: T) => {
    const valueObjectType = new ValueObjectType(name ?? target.name);

    model(valueObjectType.value)(target);
  };
