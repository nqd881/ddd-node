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
import { IModelMetadata } from "./model-metadata";

export interface Props {
  [key: PropertyKey]: any;
}

export type EmptyProps = {
  [key: PropertyKey]: never;
};

export class ModelBase<P extends Props> {
  public static readonly EMPTY_PROPS: EmptyProps = {};

  protected _props: P = ModelBase.EMPTY_PROPS as any;

  static isModel(model: any): model is AnyModel {
    return model instanceof ModelBase;
  }

  static modelMutable<T extends AnyModel>(this: ModelClass<T>) {
    return getModelMutable(this) ?? false;
  }

  static modelName<T extends AnyModel>(this: ModelClass<T>): ModelName {
    return getModelName(this);
  }

  static modelVersion<T extends AnyModel>(this: ModelClass<T>): ModelVersion {
    return getModelVersion(this);
  }

  static modelId<T extends AnyModel>(this: ModelClass<T>): ModelId {
    return getModelId(this);
  }

  static ownPropsValidator<T extends AnyModel>(
    this: ModelClass<T>
  ): PropsValidator<T> | undefined {
    return getOwnPropsValidator<T>(this);
  }

  static propsValidators<T extends AnyModel>(
    this: ModelClass<T>
  ): PropsValidator[] {
    return getPropsValidators(this);
  }

  static ownStaticValues<T extends AnyModel>(
    this: ModelClass<T>
  ): StaticValuesMap<T> {
    return getOwnStaticValues<T>(this);
  }

  static ownPropsMap<T extends AnyModel>(this: ModelClass<T>): PropsMap<T> {
    return getOwnPropsMap<T>(this.prototype);
  }

  static propsMap<T extends AnyModel>(this: ModelClass<T>): PropsMap<T> {
    return getPropsMap<T>(this.prototype);
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

  modelMetadata(): IModelMetadata<typeof this> {
    const modelClass = this.constructor as unknown as ModelClass<typeof this>;

    return {
      modelMutable: modelClass.modelMutable(),
      modelId: modelClass.modelId(),
      modelName: modelClass.modelName(),
      modelVersion: modelClass.modelVersion(),
      ownPropsValidator: modelClass.ownPropsValidator(),
      propsValidators: modelClass.propsValidators(),
      ownStaticValues: modelClass.ownStaticValues(),
      ownPropsMap: modelClass.ownPropsMap(),
      propsMap: modelClass.propsMap(),
    };
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

  metadata() {
    return {};
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
