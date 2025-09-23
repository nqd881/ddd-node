import { AnyDomainModel, DomainModelClass } from "../model";

export type ModelStaticValueBuilder<T extends AnyDomainModel = AnyDomainModel> =
  () => T;

export class ModelStaticValue<T extends AnyDomainModel = AnyDomainModel> {
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

const OWN_MODEL_STATIC_VALUES = Symbol.for("OWN_MODEL_STATIC_VALUES");

export class ModelStaticValuesMap<
  T extends AnyDomainModel = AnyDomainModel
> extends Map<PropertyKey, ModelStaticValue<T>> {}

export const getOwnModelStaticValues = <T extends AnyDomainModel>(
  target: object
) => {
  if (!Reflect.hasOwnMetadata(OWN_MODEL_STATIC_VALUES, target))
    Reflect.defineMetadata(
      OWN_MODEL_STATIC_VALUES,
      new ModelStaticValuesMap(),
      target
    );

  return Reflect.getOwnMetadata<ModelStaticValuesMap<T>>(
    OWN_MODEL_STATIC_VALUES,
    target
  )!;
};

export const setModelStaticValue = <T extends AnyDomainModel>(
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
  target: DomainModelClass,
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
