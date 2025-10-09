import { AnyDomainModel, DomainModel, InferredProps } from "../model";

const OWN_MODEL_PROPERTY_ACCESSORS = Symbol.for("OWN_MODEL_PROPERTY_ACCESSORS");

export type PropertyConverter<T = any> = (value: any) => T;

export type PropertyAccessorMetadata<T extends AnyDomainModel, R> = {
  targetKey: keyof InferredProps<T>;
  converter?: PropertyConverter<R>;
};

export class ModelPropertyAccessorMap<
  T extends AnyDomainModel = AnyDomainModel
> extends Map<PropertyKey, PropertyAccessorMetadata<T, any>> {}

// target = prototype
export const getDeclaredPropertyAccessors = <
  T extends AnyDomainModel = AnyDomainModel
>(
  target: object
): ModelPropertyAccessorMap<T> => {
  if (!Reflect.hasOwnMetadata(OWN_MODEL_PROPERTY_ACCESSORS, target)) {
    Reflect.defineMetadata(
      OWN_MODEL_PROPERTY_ACCESSORS,
      new ModelPropertyAccessorMap<T>(),
      target
    );
  }

  return Reflect.getOwnMetadata<ModelPropertyAccessorMap<T>>(
    OWN_MODEL_PROPERTY_ACCESSORS,
    target
  )!;
};

export const registerPropertyAccessor = <
  T extends AnyDomainModel = AnyDomainModel
>(
  target: object,
  key: PropertyKey,
  propTargetKey: keyof InferredProps<T>,
  propConverter?: PropertyConverter
) => {
  const declaredMap = getDeclaredPropertyAccessors<T>(target);

  declaredMap.set(key, {
    targetKey: propTargetKey,
    converter: propConverter,
  });
};

export const getResolvedPropertyAccessors = <
  T extends AnyDomainModel = AnyDomainModel
>(
  target: object
): ModelPropertyAccessorMap<T> => {
  const result = new ModelPropertyAccessorMap<T>();
  const ownMaps: ModelPropertyAccessorMap<T>[] = [];

  let current: object | null = target;
  do {
    if (DomainModel.isDomainModel(current)) {
      ownMaps.unshift(getDeclaredPropertyAccessors(current));
    }
    current = Reflect.getPrototypeOf(current);
  } while (current !== null);

  ownMaps.forEach((map) => map.forEach((meta, key) => result.set(key, meta)));

  return result;
};
