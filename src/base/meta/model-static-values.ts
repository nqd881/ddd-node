import { AnyModel, ModelClass } from "../model";

export type ModelStaticValueBuilder<T extends AnyModel = AnyModel> = () => T;

export class ModelStaticValue<T extends AnyModel = AnyModel> {
  private _value: T | ModelStaticValueBuilder<T>;

  constructor(value: T | ModelStaticValueBuilder<T>) {
    this._value = value;
  }

  get value() {
    if (typeof this._value === "function") {
      this._value = this._value();
    }

    return this._value;
  }
}

const OwnModelStaticValuesMetaKey = Symbol.for("OWN_MODEL_STATIC_VALUES");

export class ModelStaticValuesMap<T extends AnyModel = AnyModel> extends Map<
  PropertyKey,
  ModelStaticValue<T>
> {}

export const getOwnModelStaticValues = <T extends AnyModel>(target: object) => {
  if (!Reflect.hasOwnMetadata(OwnModelStaticValuesMetaKey, target))
    Reflect.defineMetadata(
      OwnModelStaticValuesMetaKey,
      new ModelStaticValuesMap(),
      target
    );

  return Reflect.getOwnMetadata<ModelStaticValuesMap<T>>(
    OwnModelStaticValuesMetaKey,
    target
  )!;
};

export const setModelStaticValue = <T extends AnyModel>(
  target: object,
  key: PropertyKey,
  value: T | ModelStaticValueBuilder<T>
) => {
  const staticValues = getOwnModelStaticValues(target);

  staticValues.set(key, new ModelStaticValue(value));
};

export const getModelStaticValue = (target: object, key: PropertyKey) => {
  let _target: object | null = target;

  do {
    const staticValues = getOwnModelStaticValues(_target);

    if (staticValues.has(key)) return staticValues.get(key)?.value;

    _target = Reflect.getPrototypeOf(_target);
  } while (_target !== null);

  return undefined;
};

export const defineModelStaticValueProperty = (
  target: ModelClass,
  key: PropertyKey
) => {
  Object.defineProperty(target, key, {
    configurable: false,
    enumerable: true,
    get() {
      return getModelStaticValue(target, key);
    },
    set() {
      throw new Error("Static value is readonly");
    },
  });
};
