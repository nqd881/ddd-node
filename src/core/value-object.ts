import _ from "lodash";
import { Class } from "type-fest";
import { ModelBase, Props, PropsOf } from "./model";
import { ClassStatic } from "../types";

export class ValueObjectBase<P extends Props> extends ModelBase<P> {
  constructor(props: P) {
    super();

    this.initializeProps(props);
  }

  override props(): P {
    return super.props()!;
  }

  equals<V extends AnyValueObject>(vo: V) {
    const equalsType = vo instanceof this.constructor;
    const equalsValue =
      JSON.stringify(vo.props()) === JSON.stringify(this.props());

    return equalsType && equalsValue;
  }

  with(props: Partial<P>) {
    const newProps = _.merge(this.props(), props);

    return new (this.constructor as ValueObjectClass<this>)(newProps);
  }
}

export type AnyValueObject = ValueObjectBase<Props>;

export interface ValueObjectClass<T extends AnyValueObject = AnyValueObject>
  extends Class<T>,
    ClassStatic<typeof ValueObjectBase<PropsOf<T>>> {}

export interface ValueObjectClassWithTypedConstructor<
  T extends AnyValueObject = AnyValueObject
> extends Class<T, ConstructorParameters<typeof ValueObjectBase<PropsOf<T>>>> {}
