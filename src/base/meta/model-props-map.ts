import { AnyModel, ModelBase, PropsOf } from "../model";

const OwnPropsMapMetaKey = Symbol.for("OWN_PROPS_MAP");

export class PropsMap<T extends AnyModel = AnyModel> extends Map<
  PropertyKey,
  keyof PropsOf<T>
> {}

// target is prototype
export const getOwnPropsMap = <T extends AnyModel = AnyModel>(
  target: object
): PropsMap<T> => {
  if (!Reflect.hasOwnMetadata(OwnPropsMapMetaKey, target))
    Reflect.defineMetadata(OwnPropsMapMetaKey, new PropsMap<T>(), target);

  return Reflect.getOwnMetadata<PropsMap<T>>(OwnPropsMapMetaKey, target)!;
};

export const defineProp = <T extends AnyModel = AnyModel>(
  target: object,
  key: PropertyKey,
  propTargetKey?: keyof PropsOf<T>
) => {
  const ownPropsMap = getOwnPropsMap<T>(target);

  if (propTargetKey) ownPropsMap.set(key, propTargetKey);
};

const PropsMapMetaKey = Symbol.for("PROPS_MAP");

export const getPropsMap = <T extends AnyModel = AnyModel>(
  target: object
): PropsMap<T> => {
  if (!Reflect.hasOwnMetadata(PropsMapMetaKey, target)) {
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
  }

  return Reflect.getOwnMetadata<PropsMap<T>>(PropsMapMetaKey, target)!;
};
