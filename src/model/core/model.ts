import _ from "lodash";
import { Class } from "type-fest";
import {
  ModelId,
  ModelName,
  ModelVersion,
  PropsMap,
  PropsValidator,
  StaticValuesMap,
  getModelId,
  getModelMutable,
  getModelName,
  getModelVersion,
  getOwnPropsMap,
  getOwnPropsValidator,
  getOwnStaticValues,
  getPropsMap,
  getPropsValidators,
} from "../meta";
import { ClassStatic } from "../../types";
import { PropsInitializedError } from "./errors";

export interface Props {
  [key: PropertyKey]: any;
}

export type EmptyProps = {
  [key: PropertyKey]: never;
};

export class ModelMetadata<T extends AnyModel = AnyModel> {
  constructor(private modelClass: ModelClass<T>) {}

  get modelMutable() {
    return getModelMutable(this.modelClass) ?? false;
  }

  get modelName(): ModelName {
    return getModelName(this.modelClass);
  }

  get modelVersion(): ModelVersion {
    return getModelVersion(this.modelClass);
  }

  get modelId(): ModelId {
    return getModelId(this.modelClass);
  }

  get ownPropsValidator(): PropsValidator<T> | undefined {
    return getOwnPropsValidator<T>(this.modelClass);
  }

  get propsValidators(): PropsValidator[] {
    return getPropsValidators(this.modelClass);
  }

  get ownStaticValues(): StaticValuesMap<T> {
    return getOwnStaticValues<T>(this.modelClass);
  }

  get ownPropsMap(): PropsMap<T> {
    return getOwnPropsMap<T>(this.modelClass.prototype);
  }

  get propsMap(): PropsMap<T> {
    return getPropsMap<T>(this.modelClass.prototype);
  }
}

export class ModelBase<P extends Props> {
  public static readonly EMPTY_PROPS: EmptyProps = {};

  protected _props: P = ModelBase.EMPTY_PROPS as any;

  static isModel(model: any): model is AnyModel {
    return model instanceof ModelBase;
  }

  static modelMetadata<T extends AnyModel>(
    this: ModelClass<T>
  ): ModelMetadata<T> {
    return new ModelMetadata(this);
  }

  constructor() {
    this.redefineModel();
  }

  redefineModel() {
    this.modelMetadata().propsMap.forEach((propTargetKey, key) => {
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

  modelMetadata(): ModelMetadata<typeof this> {
    return (
      this.constructor as unknown as ModelClass<typeof this>
    ).modelMetadata();
  }

  validateProps(props: P): void {
    const propsValidators = this.modelMetadata().propsValidators;

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

    if (!this.modelMetadata().modelMutable) {
      this._props = props;

      Object.freeze(this._props);
    } else {
      this._props = new Proxy(props, {
        set: (
          target: P,
          propKey: Extract<keyof P, PropertyKey>,
          value: any
        ) => {
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
