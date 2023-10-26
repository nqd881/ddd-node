import { AnyValueObject, ValueObjectClass } from "#base/value-object";
import {
  ValueObjectRegistry,
  defineValueObjectType,
} from "#metadata/value-object";

export const TypeValueObject = <T extends AnyValueObject>(
  valueObjectType?: string
) => {
  return <U extends ValueObjectClass<T>>(target: U) => {
    valueObjectType = valueObjectType ?? target.name;

    defineValueObjectType(target.prototype, valueObjectType);

    ValueObjectRegistry.register(valueObjectType, target);
  };
};
