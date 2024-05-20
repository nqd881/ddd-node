import { AnyModel, PropKey, PropsOf } from "../../core";
import { setProp } from "../../meta";

export const Prop = <T extends AnyModel>(propKey?: keyof PropsOf<T>) => {
  return (target: T, key: PropKey) => {
    setProp(target, key, propKey ?? (key as any));
  };
};
