import _ from "lodash";
import { AnyDomainModel, InferredProps } from "../model";

export type ModelPropsValidator<T extends AnyDomainModel = AnyDomainModel> = (
  props: InferredProps<T>
) => void;

const OwnPropsValidatorMetaKey = Symbol.for("OWN_MODEL_PROPS_VALIDATOR");

export const defineModelPropsValidator = <T extends AnyDomainModel>(
  target: object,
  validator: ModelPropsValidator<T>
) => {
  Reflect.defineMetadata(OwnPropsValidatorMetaKey, validator, target);
};

export const getOwnModelPropsValidator = <T extends AnyDomainModel>(
  target: object
) => {
  return Reflect.getOwnMetadata<ModelPropsValidator<T>>(
    OwnPropsValidatorMetaKey,
    target
  );
};

export const ModelPropsValidatorsMetaKey = Symbol.for("MODEL_PROPS_VALIDATORS");

export const getModelPropsValidators = (
  target: object
): ModelPropsValidator[] => {
  if (!Reflect.hasOwnMetadata(ModelPropsValidatorsMetaKey, target)) {
    let result = [];
    let _target: object | null = target;

    do {
      const ownValidator = getOwnModelPropsValidator(_target);

      if (ownValidator) result.push(ownValidator);

      _target = Reflect.getPrototypeOf(_target);
    } while (_target !== null);

    result = _.uniq(result);

    Reflect.defineMetadata(ModelPropsValidatorsMetaKey, result, target);
  }

  return Reflect.getOwnMetadata<ModelPropsValidator[]>(
    ModelPropsValidatorsMetaKey,
    target
  )!;
};
