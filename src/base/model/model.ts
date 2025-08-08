import _ from "lodash";
import { AbstractClass, Class } from "type-fest";
import { ClassStatic } from "../../types";
import { PropsInitializedError } from "./errors";
import { ModelDescriptor } from "./model-descriptor";

export interface Props {
  [key: PropertyKey]: any;
}

export type PropsBuilder<T extends AnyDomainModel> = () => InferredProps<T>;

export type EmptyProps = {
  [key: PropertyKey]: never;
};

export class DomainModel<P extends Props> {
  public static readonly EMPTY_PROPS: EmptyProps = {};

  static modelDescriptor<T extends AnyDomainModel>(this: DomainModelClass<T>) {
    return new ModelDescriptor(this);
  }

  static isDomainModel(model: any): model is AnyDomainModel {
    return model instanceof DomainModel;
  }

  protected _props: P = DomainModel.EMPTY_PROPS as any;

  constructor() {
    this.redefineModel();
  }

  redefineModel() {
    this.modelDescriptor()
      .modelPropsMap()
      .forEach((propTargetKey, key) => {
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

  modelDescriptor() {
    return new ModelDescriptor(this.constructor as any);
  }

  validateProps(props: P): void {
    const modelPropsValidators = this.modelDescriptor().modelPropsValidators();

    modelPropsValidators.forEach((propsValidator) =>
      propsValidator.call(this.constructor, props)
    );
  }

  validate() {
    this.validateProps(this._props);
  }

  propsIsEmpty() {
    return this._props === (DomainModel.EMPTY_PROPS as any);
  }

  props(): P | null {
    if (this.propsIsEmpty()) return null;

    return _.cloneDeepWith(this._props, (value) => {
      if (DomainModel.isDomainModel(value)) {
        value.redefineModel();

        return value;
      }
    });
  }

  metadata(): any {
    return {};
  }

  protected initializeProps(propsOrBuilder: P | PropsBuilder<typeof this>) {
    if (!this.propsIsEmpty()) throw new PropsInitializedError();

    let props: P;

    if (typeof propsOrBuilder === "function") props = propsOrBuilder.call(this);
    else props = propsOrBuilder;

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

export type AnyDomainModel = DomainModel<Props>;

export type InferredProps<T extends AnyDomainModel> = T extends DomainModel<
  infer P
>
  ? P
  : never;

export type DomainModelClass<T extends AnyDomainModel = AnyDomainModel> =
  Class<T> & ClassStatic<typeof DomainModel<InferredProps<T>>>;

export type AbstractDomainModelClass<
  T extends AnyDomainModel = AnyDomainModel
> = AbstractClass<T> & ClassStatic<typeof DomainModel<InferredProps<T>>>;
