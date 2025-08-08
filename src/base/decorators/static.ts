import { DomainModelClass } from "../model";
import {
  ModelStaticValueBuilder,
  defineModelStaticValueProperty,
  setModelStaticValue,
} from "../meta";

export const Static = <
  T extends DomainModelClass,
  I extends InstanceType<T> = InstanceType<T>
>(
  builder: ModelStaticValueBuilder<I>
) => {
  return (target: T, key: PropertyKey) => {
    setModelStaticValue(target, key, builder);

    defineModelStaticValueProperty(target, key);
  };
};
