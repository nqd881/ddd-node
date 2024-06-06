import _ from "lodash";
import { AnyModel, ModelBase, ModelClass, PropKey, PropsOf } from "../core";
import { StaticValue, StaticValueBuilder } from "./helpers/static-value";

const OwnPropsMapMetaKey = Symbol.for("OWN_PROPS_MAP");

export class PropsMap<T extends AnyModel = AnyModel> extends Map<
  PropKey,
  keyof PropsOf<T>
> {}

// target is prototype
export const getOwnPropsMap = <T extends AnyModel = AnyModel>(
  target: T
): PropsMap<T> => {
  const ownPropsMap = () => Reflect.getOwnMetadata(OwnPropsMapMetaKey, target);

  if (!ownPropsMap())
    Reflect.defineMetadata(OwnPropsMapMetaKey, new PropsMap<T>(), target);

  return ownPropsMap();
};

export const setProp = <T extends AnyModel = AnyModel>(
  target: T,
  key: PropKey,
  propTargetKey?: keyof PropsOf<T>
) => {
  const ownPropsMap = getOwnPropsMap<T>(target);

  if (propTargetKey) ownPropsMap.set(key, propTargetKey);
};

const PropsMapMetaKey = Symbol.for("PROPS_MAP");

export const getPropsMap = <T extends AnyModel = AnyModel>(
  target: T
): PropsMap<T> => {
  const propsMap = () => Reflect.getOwnMetadata(PropsMapMetaKey, target);

  if (propsMap()) return propsMap();

  const buildPropsMap = (target: object) => {
    let _target: object | null = target;

    const result = new PropsMap<T>();

    const ownPropsMapList = [];

    do {
      if (ModelBase.isModel(_target)) {
        const ownPropsMap = getOwnPropsMap(_target);

        ownPropsMapList.unshift(ownPropsMap);
      }

      _target = Reflect.getPrototypeOf(_target);
    } while (_target !== null);

    ownPropsMapList.forEach((ownPropsMap) => {
      ownPropsMap.forEach((targetPropKey, key) =>
        result.set(key, targetPropKey)
      );
    });

    return result;
  };

  Reflect.defineMetadata(PropsMapMetaKey, buildPropsMap(target), target);

  return propsMap();
};

//

const ModelNameMetaKey = Symbol.for("MODEL_NAME");

export const setModelName = <T extends AnyModel>(
  target: ModelClass<T>,
  name: string
) => {
  Reflect.defineMetadata(ModelNameMetaKey, name, target);
};

export const getModelName = <T extends AnyModel>(
  target: ModelClass<T>
): string => {
  const modelName = () => Reflect.getOwnMetadata(ModelNameMetaKey, target);

  if (!modelName()) setModelName(target, target.name);

  return modelName();
};

//

const ModelVersionMetaKey = Symbol.for("MODEL_VERSION");

export const setModelVersion = <T extends AnyModel>(
  target: ModelClass<T>,
  version: number
) => {
  Reflect.defineMetadata(ModelVersionMetaKey, version, target);
};

export const getModelVersion = <T extends AnyModel>(
  target: ModelClass<T>
): number => {
  const modelVersion = () =>
    Reflect.getOwnMetadata(ModelVersionMetaKey, target);

  if (!modelVersion()) setModelVersion(target, 0);

  return modelVersion();
};
//

export type PropsValidator<T extends AnyModel = AnyModel> = (
  props: PropsOf<T>
) => void;

const OwnPropsValidatorMetaKey = Symbol.for("OWN_PROPS_VALIDATOR");

export const setPropsValidator = <T extends AnyModel>(
  target: object,
  validator: PropsValidator<T>
) => {
  Reflect.defineMetadata(OwnPropsValidatorMetaKey, validator, target);
};

export const getOwnPropsValidator = <T extends AnyModel>(
  target: object
): PropsValidator<T> | undefined => {
  return Reflect.getOwnMetadata(OwnPropsValidatorMetaKey, target);
};

export const PropsValidatorsMetaKey = Symbol.for("PROPS_VALIDATORS");

export const getPropsValidators = (
  target: object
): PropsValidator<AnyModel>[] => {
  const validators = () =>
    Reflect.getOwnMetadata(PropsValidatorsMetaKey, target);

  if (validators()) return validators();

  let result = [];
  let _target: object | null = target;

  do {
    const ownValidator = getOwnPropsValidator(_target);

    if (ownValidator) result.push(ownValidator);

    _target = Reflect.getPrototypeOf(_target);
  } while (_target !== null);

  result = _.uniq(result);

  Reflect.defineMetadata(PropsValidatorsMetaKey, result, target);

  return validators();
};

//
const OwnStaticValuesMetaKey = Symbol.for("OWN_STATIC_VALUES");

export const getOwnStaticValues = <T extends AnyModel>(
  target: object
): Map<string | symbol, StaticValue<T>> => {
  const ownStaticValues = () =>
    Reflect.getOwnMetadata(OwnStaticValuesMetaKey, target);

  if (!ownStaticValues())
    Reflect.defineMetadata(OwnStaticValuesMetaKey, new Map(), target);

  return ownStaticValues();
};

export const setStaticValue = <T extends AnyModel>(
  target: object,
  key: string,
  value: T | StaticValueBuilder<T>
) => {
  const staticValues = getOwnStaticValues(target);

  staticValues.set(key, new StaticValue(value));
};

export const getStaticValue = (target: object, key: string | symbol) => {
  let _target: object | null = target;

  do {
    const staticValues = getOwnStaticValues(_target);

    if (staticValues.has(key)) return staticValues.get(key)?.value;

    _target = Reflect.getPrototypeOf(_target);
  } while (_target !== null);

  return undefined;
};
