import _ from "lodash";
import { Class } from "type-fest";
import { ModelBase, Mutable, Props, InferredProps } from "../../base";
import { ClassStatic } from "../../types";

@Mutable(false)
export class ValueObjectBase<P extends Props> extends ModelBase<P> {
  constructor(props: P) {
    super();

    this.initializeProps(props);
  }

  override props() {
    return super.props()!;
  }

  equals<V extends AnyValueObject>(vo: V) {
    const equalsType = vo instanceof this.constructor;

    const equalsValue = this.getEqualityValue() === vo.getEqualityValue();

    return equalsType && equalsValue;
  }

  with(props: Partial<P>): typeof this {
    const newProps = _.merge(this.props(), props);

    return new (this.constructor as ValueObjectClass<typeof this>)(newProps);
  }

  clone() {
    return this.with({});
  }

  getEqualityValue() {
    return JSON.stringify(this.getEqualityObject());
  }

  protected getEqualityObject() {
    const result: any = {};

    const props = this.props();

    const valueOf = (v: any) =>
      v instanceof ValueObjectBase ? v.getEqualityObject() : v;

    for (let [key, value] of Object.entries(props)) {
      if (Array.isArray(value)) {
        result[key] = value.map((v) => valueOf(v));

        const stringValueOf = (v: any) => JSON.stringify(v);

        (result[key] as any[]).sort((a, b) => {
          return stringValueOf(a).localeCompare(stringValueOf(b));
        });

        continue;
      }

      result[key] = valueOf(value);
    }

    return result;
  }
}

export type AnyValueObject = ValueObjectBase<Props>;

export interface ValueObjectClass<T extends AnyValueObject = AnyValueObject>
  extends Class<T>,
    ClassStatic<typeof ValueObjectBase<InferredProps<T>>> {}

export interface ValueObjectClassWithTypedConstructor<
  T extends AnyValueObject = AnyValueObject
> extends Class<
    T,
    ConstructorParameters<typeof ValueObjectBase<InferredProps<T>>>
  > {}
