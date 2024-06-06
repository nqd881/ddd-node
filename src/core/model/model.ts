import _ from "lodash";
import { Class } from "type-fest";
import {
  getModelName,
  getModelVersion,
  getOwnPropsMap,
  getOwnPropsValidator,
  getOwnStaticValues,
  getPropsMap,
  getPropsValidators,
} from "../../meta";
import { ClassStatic } from "../../types";
import { PropsInitializedError } from "./errors";

export type PropKey = string | symbol;

export interface Props {
  [key: PropKey]: any;
}

export type EmptyProps = {
  [key: PropKey]: never;
};

export class ModelBase<P extends Props> {
  public static readonly EMPTY_PROPS: EmptyProps = {};

  protected _props: P = ModelBase.EMPTY_PROPS as any;

  static isModel(model: any): model is AnyModel {
    return model instanceof ModelBase;
  }

  static mutable(): boolean {
    return false;
  }

  static modelName<T extends AnyModel>(this: ModelClass<T>) {
    return getModelName(this);
  }

  static modelVersion<T extends AnyModel>(this: ModelClass<T>) {
    return getModelVersion(this);
  }

  static ownPropsValidator<T extends AnyModel>(this: ModelClass<T>) {
    return getOwnPropsValidator<T>(this);
  }

  static propsValidators<T extends AnyModel>(this: ModelClass<T>) {
    return getPropsValidators(this);
  }

  static ownStaticValues<T extends AnyModel>(this: ModelClass<T>) {
    return getOwnStaticValues<T>(this);
  }

  static ownPropsMap() {
    return getOwnPropsMap(this.prototype);
  }

  static propsMap() {
    return getPropsMap(this.prototype);
  }

  constructor() {
    this.redefineModel();
  }

  protected redefineModel() {
    this.propsMap().forEach((propTargetKey, key) => {
      this.redefineProp(key as keyof this, propTargetKey);
    });
  }

  protected redefineProp(key: keyof this, propTargetKey: keyof P) {
    Object.defineProperty(this, key, {
      // must be true because the props() method need to recall redefineModel(-> redefineProp)
      configurable: true,
      enumerable: true,
      get() {
        return this._props?.[propTargetKey];
      },
    });
  }

  protected get _modelClass() {
    return this.constructor as ModelClass<this>;
  }

  isMutable() {
    return this._modelClass.mutable();
  }

  modelName() {
    return this._modelClass.modelName();
  }

  modelVersion() {
    return this._modelClass.modelVersion();
  }

  ownPropsValidator() {
    return this._modelClass.ownPropsValidator();
  }

  propsValidators() {
    return this._modelClass.propsValidators();
  }

  ownPropsMap() {
    return this._modelClass.ownPropsMap();
  }

  propsMap() {
    return getPropsMap(Reflect.getPrototypeOf(this) as any);
  }

  validateProps(props: P): void {
    const propsValidators = this.propsValidators();

    propsValidators.forEach((propsValidator) => propsValidator(props));
  }

  validate() {
    this.validateProps(this._props);
  }

  propsIsEmpty() {
    return this._props === (ModelBase.EMPTY_PROPS as any);
  }

  props(): P | null {
    if (this.propsIsEmpty()) return null;

    return _.cloneDeepWith(this._props, (value) => {
      if (ModelBase.isModel(value)) {
        value.redefineModel();

        return value;
      }
    });
  }

  protected initializeProps(props: P) {
    if (!this.propsIsEmpty()) throw new PropsInitializedError();

    if (!this.isMutable()) {
      this._props = props;

      Object.freeze(this._props);
    } else {
      this._props = new Proxy(props, {
        set: (target: P, propKey: Extract<keyof P, PropKey>, value: any) => {
          let result = Reflect.set(target, propKey, value);

          this.validate();

          return result;
        },
      });
    }

    this.validate();
  }
}

export type AnyModel = ModelBase<Props>;

export type PropsOf<T extends AnyModel> = T extends ModelBase<
  infer P extends Props
>
  ? P
  : never;

export interface ModelClass<T extends AnyModel = AnyModel>
  extends Class<T>,
    ClassStatic<typeof ModelBase<PropsOf<T>>> {}
