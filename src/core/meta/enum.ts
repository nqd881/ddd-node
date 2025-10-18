import "reflect-metadata";

const ENUM_PROP_SET = Symbol.for("ENUM_PROP_SET");

export type EnumProperty<T extends Object = Object> = Extract<keyof T, string>;

export class EnumPropertySet<T extends Object = Object> extends Set<
  EnumProperty<T>
> {}

export const markEnumProperty = <T extends Object>(
  target: T,
  key: EnumProperty<T>
) => {
  const enumSet = getOwnEnumPropertySet(target);

  enumSet.add(key);
};

export const getOwnEnumPropertySet = <T extends Object>(target: T) => {
  if (!Reflect.getOwnMetadata(ENUM_PROP_SET, target)) {
    Reflect.defineMetadata(ENUM_PROP_SET, new EnumPropertySet(), target);
  }

  return Reflect.getOwnMetadata<EnumPropertySet<T>>(ENUM_PROP_SET, target)!;
};

export const getEnumPropertySet = <T extends Object>(
  target: T
): EnumPropertySet<T> => {
  let _target: object | null = target;
  const result = new EnumPropertySet<T>();

  do {
    const ownMarkedEnumValues = getOwnEnumPropertySet(_target);

    ownMarkedEnumValues.forEach((markedEnumValue) => {
      result.add(markedEnumValue);
    });

    _target = Reflect.getPrototypeOf(_target);
  } while (_target !== null);

  return result;
};
