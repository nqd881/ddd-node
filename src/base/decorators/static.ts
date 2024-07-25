import { ModelClass } from "../model";
import {
  StaticValueBuilder,
  defineStaticValueProperty,
  setStaticValue,
} from "../meta";

export const Static = <
  T extends ModelClass,
  I extends InstanceType<T> = InstanceType<T>
>(
  builder: StaticValueBuilder<I>
) => {
  return (target: T, key: PropertyKey) => {
    setStaticValue(target, key, builder);

    defineStaticValueProperty(target, key);
  };
};
