import _ from "lodash";
import { AnyModel, PropsOf } from "../core";

export type PropsValidator<T extends AnyModel = AnyModel> = (
  props: PropsOf<T>
) => void;

const OwnPropsValidatorMetaKey = Symbol.for("OWN_PROPS_VALIDATOR");

export const definePropsValidator = <T extends AnyModel>(
  target: object,
  validator: PropsValidator<T>
) => {
  Reflect.defineMetadata(OwnPropsValidatorMetaKey, validator, target);
};

export const getOwnPropsValidator = <T extends AnyModel>(target: object) => {
  return Reflect.getOwnMetadata<PropsValidator<T>>(
    OwnPropsValidatorMetaKey,
    target
  );
};

export const PropsValidatorsMetaKey = Symbol.for("PROPS_VALIDATORS");

export const getPropsValidators = (target: object): PropsValidator[] => {
  if (!Reflect.hasOwnMetadata(PropsValidatorsMetaKey, target)) {
    let result = [];
    let _target: object | null = target;

    do {
      const ownValidator = getOwnPropsValidator(_target);

      if (ownValidator) result.push(ownValidator);

      _target = Reflect.getPrototypeOf(_target);
    } while (_target !== null);

    result = _.uniq(result);

    Reflect.defineMetadata(PropsValidatorsMetaKey, result, target);
  }

  return Reflect.getOwnMetadata<PropsValidator[]>(
    PropsValidatorsMetaKey,
    target
  )!;
};
