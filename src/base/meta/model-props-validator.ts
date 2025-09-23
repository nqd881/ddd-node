import _ from "lodash";
import { AnyDomainModel, InferredProps } from "../model";

export type ModelPropsValidator<T extends AnyDomainModel = AnyDomainModel> = (
  props: InferredProps<T>
) => void;

const OWN_MODEL_PROPS_VALIDATOR = Symbol.for("OWN_MODEL_PROPS_VALIDATOR");

export const defineModelPropGettersValidator = <T extends AnyDomainModel>(
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

export const MODEL_PROPS_VALIDATORS = Symbol.for("MODEL_PROPS_VALIDATORS");

export const getModelPropsValidators = (
  target: object
): ModelPropsValidator[] => {
  if (!Reflect.hasOwnMetadata(MODEL_PROPS_VALIDATORS, target)) {
    let result = [];
    let _target: object | null = target;

    do {
      const ownValidator = getOwnModelPropsValidator(_target);

      if (ownValidator) result.push(ownValidator);

      _target = Reflect.getPrototypeOf(_target);
    } while (_target !== null);

    result = _.uniq(result);

    Reflect.defineMetadata(MODEL_PROPS_VALIDATORS, result, target);
  }

  return Reflect.getOwnMetadata<ModelPropsValidator[]>(
    MODEL_PROPS_VALIDATORS,
    target
  )!;
};
