import { Class } from "#types";
import _ from "lodash";
import { Model, PropsOf } from "./model";

export class ValueObject<Props extends object> extends Model<Props> {
  constructor(props: Props) {
    super(props);
  }

  equals<V extends AnyValueObject>(vo: V) {
    const equalsType = vo instanceof this.constructor;
    const equalsValue = JSON.stringify(vo) === JSON.stringify(this);

    return equalsType && equalsValue;
  }

  with(props: Partial<Props>) {
    const newProps = _.merge(this.props(), props);

    return new (this.constructor as Class<ValueObject<Props>>)(
      newProps
    ) as typeof this;
  }
}

export type AnyValueObject = ValueObject<any>;

export type ValueObjectClass<T extends AnyValueObject = AnyValueObject> =
  Class<T>;

export type ValueObjectClassWithTypedConstructor<
  T extends AnyValueObject = AnyValueObject
> = Class<T, ConstructorParameters<typeof ValueObject<PropsOf<T>>>>;
