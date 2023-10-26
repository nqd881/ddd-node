import { getValueObjectType } from "#metadata/value-object";
import { Class } from "#types/class";
import { ClassStatic } from "#types/class-static";
import _ from "lodash";
import { PropsEnvelope, PropsOf } from "./props-envelope";

export class ValueObject<P extends object> extends PropsEnvelope<P> {
  constructor(props: P) {
    super(props);
  }

  static valueObjectType() {
    return getValueObjectType(this.prototype);
  }

  valueObjectType() {
    const prototype = Object.getPrototypeOf(this);

    return getValueObjectType(prototype);
  }

  equals<V extends AnyValueObject>(vo: V) {
    const equalsType = vo instanceof this.constructor;
    const equalsValue = JSON.stringify(vo) === JSON.stringify(this);

    return equalsType && equalsValue;
  }

  with(props: Partial<P>) {
    const newProps = _.merge(this.getProps(), props);

    return new (this.constructor as ValueObjectClassWithProps<P>)(
      newProps
    ) as typeof this;
  }
}

export type AnyValueObject = ValueObject<any>;

export type ValueObjectConstructorParamsWithProps<P extends object> =
  ConstructorParameters<typeof ValueObject<P>>;

export type ValueObjectClassWithProps<P extends object> = Class<
  ValueObject<P>,
  ValueObjectConstructorParamsWithProps<P>
> &
  ClassStatic<typeof ValueObject<P>>;

export type ValueObjectConstructorParams<T extends AnyValueObject> =
  ValueObjectConstructorParamsWithProps<PropsOf<T>>;

export type ValueObjectClass<T extends AnyValueObject> = Class<
  T,
  ValueObjectConstructorParams<T>
> &
  ClassStatic<typeof ValueObject<PropsOf<T>>>;

export type AnyValueObjectClass = ValueObjectClass<AnyValueObject>;
