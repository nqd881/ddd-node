import _ from "lodash";
import { AbstractClass, Class } from "type-fest";
import { PropertyConverter } from "..";
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
    this.definePropertyAccessors();
  }

  definePropertyAccessors() {
    this.modelDescriptor.resolvedPropertyAccessors.forEach(
      ({ targetKey, converter }, key) => {
        this.definePropAccessor(key as keyof this, targetKey, converter);
      }
    );
  }

  protected definePropAccessor<K extends keyof P>(
    key: keyof this,
    propTargetKey: K,
    propConverter?: PropertyConverter
  ) {
    Object.defineProperty(this, key, {
      configurable: false,
      enumerable: true,
      get() {
        const value = this._props?.[propTargetKey];

        if (!propConverter) return value;

        return propConverter(value);
      },
    });
  }

  get modelDescriptor() {
    return new ModelDescriptor(this.constructor as any);
  }

  validateProps(props: P): void {
    const modelPropsValidators = this.modelDescriptor.modelPropsValidators;

    modelPropsValidators.forEach((propsValidator) =>
      propsValidator.validate(props)
    );
  }

  validate() {
    this.validateProps(this._props);
  }

  isPropsEmpty(): this is InitializedDomainModel<P> {
    return this._props === (DomainModel.EMPTY_PROPS as any);
  }

  props(): P | null {
    if (this.isPropsEmpty()) return null;

    return _.cloneDeep(this._props);
  }

  metadata(): any {
    return {};
  }

  protected initializeProps(propsOrBuilder: P | PropsBuilder<typeof this>) {
    if (!this.isPropsEmpty()) throw new PropsInitializedError();

    let props: P;

    if (typeof propsOrBuilder === "function") props = propsOrBuilder.call(this);
    else props = propsOrBuilder;

    if (!this.modelDescriptor.modelMutable) {
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

export type InitializedDomainModel<P extends Props> = DomainModel<P> & {
  props(): P;
};

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
