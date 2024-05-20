import { ModelClass } from "../../core";
import { StaticValueBuilder, getStaticValue, setStaticValue } from "../../meta";

export const Static = <
  T extends ModelClass,
  I extends InstanceType<T> = InstanceType<T>
>(
  builder: StaticValueBuilder<I>
) => {
  return (target: T, key: string) => {
    setStaticValue(target, key, builder);

    Object.defineProperty(target, key, {
      configurable: false,
      enumerable: true,
      get() {
        return getStaticValue(target, key);
      },
      set() {
        throw new Error("Static value is readonly");
      },
    });
  };
};
