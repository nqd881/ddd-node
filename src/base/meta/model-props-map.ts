import { AnyDomainModel, DomainModel, InferredProps } from "../model";

const OwnModelPropsMapMetaKey = Symbol.for("OWN_MODEL_PROPS_MAP");

export class ModelPropsMap<
  T extends AnyDomainModel = AnyDomainModel
> extends Map<PropertyKey, keyof InferredProps<T>> {}

// target is prototype
export const getOwnModelPropsMap = <T extends AnyDomainModel = AnyDomainModel>(
  target: object
): ModelPropsMap<T> => {
  if (!Reflect.hasOwnMetadata(OwnModelPropsMapMetaKey, target))
    Reflect.defineMetadata(
      OwnModelPropsMapMetaKey,
      new ModelPropsMap<T>(),
      target
    );

  return Reflect.getOwnMetadata<ModelPropsMap<T>>(
    OwnModelPropsMapMetaKey,
    target
  )!;
};

export const defineModelProp = <T extends AnyDomainModel = AnyDomainModel>(
  target: object,
  key: PropertyKey,
  propTargetKey?: keyof InferredProps<T>
) => {
  const ownModelPropsMap = getOwnModelPropsMap<T>(target);

  if (propTargetKey) ownModelPropsMap.set(key, propTargetKey);
};

const ModelPropsMapMetaKey = Symbol.for("MODEL_PROPS_MAP");

export const getModelPropsMap = <T extends AnyDomainModel = AnyDomainModel>(
  target: object
): ModelPropsMap<T> => {
  if (!Reflect.hasOwnMetadata(ModelPropsMapMetaKey, target)) {
    const buildPropsMap = (target: object) => {
      let _target: object | null = target;

      const result = new ModelPropsMap<T>();

      const ownPropsMapList = [];

      do {
        if (DomainModel.isDomainModel(_target)) {
          const ownModelPropsMap = getOwnModelPropsMap(_target);

          ownPropsMapList.unshift(ownModelPropsMap);
        }

        _target = Reflect.getPrototypeOf(_target);
      } while (_target !== null);

      ownPropsMapList.forEach((ownModelPropsMap) => {
        ownModelPropsMap.forEach((targetPropKey, key) =>
          result.set(key, targetPropKey)
        );
      });

      return result;
    };

    Reflect.defineMetadata(ModelPropsMapMetaKey, buildPropsMap(target), target);
  }

  return Reflect.getOwnMetadata<ModelPropsMap<T>>(
    ModelPropsMapMetaKey,
    target
  )!;
};
