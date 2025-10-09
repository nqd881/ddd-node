import isClass from "is-class";
import _ from "lodash";
import { Class } from "type-fest";
import { AnyDomainModel, InferredProps } from "../model";

export interface ModelPropsValidator<
  T extends AnyDomainModel = AnyDomainModel
> {
  validate(props: InferredProps<T>): void;
}

export type ModelPropsValidateFn<T extends AnyDomainModel> =
  ModelPropsValidator<T>["validate"];

export type ModelPropsValidatorBuilder<T extends AnyDomainModel> =
  () => ModelPropsValidator<T>;

export type ModelPropsValidatorWrapperInput<T extends AnyDomainModel> =
  | Class<ModelPropsValidator<T>, []>
  | ModelPropsValidator<T>
  | ModelPropsValidateFn<T>
  | ModelPropsValidatorBuilder<T>;

export class ModelPropsValidatorWrapper<T extends AnyDomainModel>
  implements ModelPropsValidator<T>
{
  constructor(private input: ModelPropsValidatorWrapperInput<T>) {}

  validate(props: InferredProps<T>): void {
    if (isClass(this.input)) {
      const instance = new this.input();
      return instance.validate(props);
    }

    if (typeof this.input === "function") {
      const res = this.input(props);

      const resIsValidator =
        res && typeof res === "object" && "validate" in res;

      if (resIsValidator) {
        return res.validate(props);
      }

      return res;
    }

    return this.input.validate(props);
  }
}

const OWN_MODEL_PROPS_VALIDATOR = Symbol.for("OWN_MODEL_PROPS_VALIDATOR");

export const defineModelPropsValidator = <T extends AnyDomainModel>(
  target: object,
  validator: ModelPropsValidator<T>
) => {
  Reflect.defineMetadata(OWN_MODEL_PROPS_VALIDATOR, validator, target);
};

export const getOwnModelPropsValidator = <T extends AnyDomainModel>(
  target: object
) => {
  return Reflect.getOwnMetadata<ModelPropsValidator<T>>(
    OWN_MODEL_PROPS_VALIDATOR,
    target
  );
};

export const getModelPropsValidators = (
  target: object
): ModelPropsValidator[] => {
  let result: ModelPropsValidator[] = [];
  let _target: object | null = target;

  do {
    const ownValidator = getOwnModelPropsValidator(_target);

    if (ownValidator) result.push(ownValidator);

    _target = Reflect.getPrototypeOf(_target);
  } while (_target !== null);

  result = _.uniq(result);

  return result;
};
