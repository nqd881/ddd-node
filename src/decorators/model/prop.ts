import { AnyModel, PropKey, PropsOf } from "../../core";
import { setProp } from "../../meta";

export const Prop = <T extends AnyModel>(propTargetKey?: keyof PropsOf<T>) => {
  return (target: T, key: PropKey) => {
    setProp(target, key, propTargetKey ?? (key as any));
  };
};
