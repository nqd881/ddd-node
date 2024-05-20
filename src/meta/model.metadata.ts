import { AnyModel, ModelBase, ModelClass, PropKey, PropsOf } from "../core";
import { StaticValue, StaticValueBuilder } from "./helpers/static-value";

const OwnPropsMapMetaKey = Symbol.for("OWN_PROPS_MAP");

// Prop keys map is a Map<Key, TargetPropKey>;

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
  targetPropKey?: keyof PropsOf<T>
) => {
  const ownPropsMap = getOwnPropsMap<T>(target);

  if (targetPropKey) ownPropsMap.set(key, targetPropKey);
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
  name?: string
) => {
  Reflect.defineMetadata(ModelNameMetaKey, name ?? target.name, target);
};

export const getModelName = <T extends AnyModel>(
  target: ModelClass<T>
): string => {
  const modelName = () => Reflect.getMetadata(ModelNameMetaKey, target);

  if (!modelName()) setModelName(target);

  return modelName();
};

//

export type PropsValidator<T extends AnyModel = AnyModel> = (
  props: PropsOf<T>
) => void;

const PropsValidatorMetaKey = Symbol.for("PROPS_VALIDATOR");

export const setPropsValidator = <T extends AnyModel>(
  target: object,
  validator: PropsValidator<T>
) => {
  Reflect.defineMetadata(PropsValidatorMetaKey, validator, target);
};

export const getPropsValidator = <T extends AnyModel>(
  target: object
): PropsValidator<T> | undefined => {
  return Reflect.getMetadata(PropsValidatorMetaKey, target);
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
