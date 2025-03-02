import _ from "lodash";
import { AbstractClass, Class } from "type-fest";
import { ClassStatic } from "../../types";
import {
  ModelId,
  ModelName,
  ModelPropsMap,
  ModelPropsValidator,
  ModelStaticValuesMap,
  ModelVersion,
  getModelId,
  getModelMutable,
  getModelName,
  getModelPropsMap,
  getModelPropsValidators,
  getModelVersion,
  getOwnModelPropsMap,
  getOwnModelPropsValidator,
  getOwnModelStaticValues,
} from "../meta";
import { PropsInitializedError } from "./errors";
import { ModelDescriptor } from "./model-descriptor";

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

  static ownModelPropsValidator<T extends AnyModel>(
    this: ModelClass<T>
  ): ModelPropsValidator<T> | undefined {
    return getOwnModelPropsValidator<T>(this);
  }

  static modelPropsValidators<T extends AnyModel>(
    this: ModelClass<T>
  ): ModelPropsValidator[] {
    return getModelPropsValidators(this);
  }

  static ownModelStaticValues<T extends AnyModel>(
    this: ModelClass<T>
  ): ModelStaticValuesMap<T> {
    return getOwnModelStaticValues<T>(this);
  }

  static ownModelPropsMap<T extends AnyModel>(
    this: ModelClass<T>
  ): ModelPropsMap<T> {
    return getOwnModelPropsMap<T>(this.prototype);
  }

  static modelPropsMap<T extends AnyModel>(
    this: ModelClass<T>
  ): ModelPropsMap<T> {
    return getModelPropsMap<T>(this.prototype);
  }

  constructor() {
    this.redefineModel();
  }

  redefineModel() {
    this.modelDescriptor().modelPropsMap.forEach((propTargetKey, key) => {
      this.redefineProp(key as keyof this, propTargetKey);
    });
  }

  protected redefineProp<K extends keyof P>(key: keyof this, propTargetKey: K) {
    Object.defineProperty(this, key, {
      // must be true because the props() method need to recall redefineModel(-> redefineProp)
      configurable: true,
      enumerable: true,
      get() {
        return this._props?.[propTargetKey];
      },
    });
  }

  modelDescriptor(): ModelDescriptor<typeof this> {
    const modelClass = this.constructor as unknown as ModelClass<typeof this>;

    return {
      modelMutable: modelClass.modelMutable(),
      modelId: modelClass.modelId(),
      modelName: modelClass.modelName(),
      modelVersion: modelClass.modelVersion(),
      ownModelPropsValidator: modelClass.ownModelPropsValidator(),
      modelPropsValidators: modelClass.modelPropsValidators(),
      ownModelStaticValues: modelClass.ownModelStaticValues(),
      ownModelPropsMap: modelClass.ownModelPropsMap(),
      modelPropsMap: modelClass.modelPropsMap(),
    };
  }

  validateProps(props: P): void {
    const modelPropsValidators = this.modelDescriptor().modelPropsValidators;

    modelPropsValidators.forEach((propsValidator) =>
      propsValidator.call(this.constructor, props)
    );
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

  metadata(): any {
    return {};
  }

  protected initializeProps(props: P) {
    if (!this.propsIsEmpty()) throw new PropsInitializedError();

    if (!this.modelDescriptor().modelMutable) {
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

export type InferredProps<T extends AnyModel> = T extends ModelBase<infer P>
  ? P
  : never;

export interface ModelClass<T extends AnyModel = AnyModel>
  extends Class<T>,
    ClassStatic<typeof ModelBase<InferredProps<T>>> {}

export interface AbstractModelClass<T extends AnyModel = AnyModel>
  extends AbstractClass<T>,
    ClassStatic<typeof ModelBase<InferredProps<T>>> {}
