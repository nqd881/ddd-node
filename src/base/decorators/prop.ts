import { AnyModel, PropsOf } from "../model";
import { defineProp } from "../meta";

export const Prop = <T extends AnyModel>(propTargetKey?: keyof PropsOf<T>) => {
  return (target: T, key: PropertyKey) => {
    defineProp(target, key, propTargetKey ?? key);
  };
};
