import { AnyDomainModel, InferredProps } from "../model";
import { defineModelProp } from "../meta";

export const Prop = <T extends AnyDomainModel>(
  propTargetKey?: keyof InferredProps<T>
) => {
  return (target: T, key: PropertyKey) => {
    defineModelProp(target, key, propTargetKey ?? key);
  };
};
