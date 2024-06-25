import { AnyModel, ModelClass } from "../core";

export type StaticValueBuilder<T extends AnyModel = AnyModel> = () => T;

export class StaticValue<T extends AnyModel = AnyModel> {
  private _value: T | StaticValueBuilder<T>;

  constructor(value: T | StaticValueBuilder<T>) {
    this._value = value;
  }

  get value() {
    if (typeof this._value === "function") {
      this._value = this._value();
    }

    return this._value;
  }
}

const OwnStaticValuesMetaKey = Symbol.for("OWN_STATIC_VALUES");

export class StaticValuesMap<T extends AnyModel> extends Map<
  PropertyKey,
  StaticValue<T>
> {}

export const getOwnStaticValues = <T extends AnyModel>(target: object) => {
  if (!Reflect.hasOwnMetadata(OwnStaticValuesMetaKey, target))
    Reflect.defineMetadata(
      OwnStaticValuesMetaKey,
      new StaticValuesMap(),
      target
    );

  return Reflect.getOwnMetadata<StaticValuesMap<T>>(
    OwnStaticValuesMetaKey,
    target
  )!;
};

export const setStaticValue = <T extends AnyModel>(
  target: object,
  key: PropertyKey,
  value: T | StaticValueBuilder<T>
) => {
  const staticValues = getOwnStaticValues(target);

  staticValues.set(key, new StaticValue(value));
};

export const getStaticValue = (target: object, key: PropertyKey) => {
  let _target: object | null = target;

  do {
    const staticValues = getOwnStaticValues(_target);

    if (staticValues.has(key)) return staticValues.get(key)?.value;

    _target = Reflect.getPrototypeOf(_target);
  } while (_target !== null);

  return undefined;
};

export const defineStaticValueProperty = (
  target: ModelClass,
  key: PropertyKey
) => {
  Object.defineProperty(target, key, {
    configurable: false,
    enumerable: true,
    get() {
      return getStaticValue(target, key);
    },
    set() {
      throw new Error("Static value is readonly");
    },
  });
};
