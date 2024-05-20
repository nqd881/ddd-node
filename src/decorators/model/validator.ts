import { ModelClass } from "../../core";
import { PropsValidator, setPropsValidator } from "../../meta";

export const Validator = <
  T extends ModelClass,
  I extends InstanceType<T> = InstanceType<T>
>(
  validator?: PropsValidator<I>
) => {
  return (target: T) => {
    if (validator) setPropsValidator(target, validator);
  };
};
