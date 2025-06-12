import { Class } from "type-fest";
import { ModelBase, Props, InferredProps } from "../../base";
import { ClassStatic } from "../../types";
export declare class ValueObjectBase<P extends Props> extends ModelBase<P> {
    constructor(props: P);
    props(): P;
    equals<V extends AnyValueObject>(vo: V): boolean;
    with(props: Partial<P>): typeof this;
    clone(): this;
    getEqualityValue(): string;
    protected getEqualityObject(): any;
}
export type AnyValueObject = ValueObjectBase<Props>;
export interface ValueObjectClass<T extends AnyValueObject = AnyValueObject> extends Class<T>, ClassStatic<typeof ValueObjectBase<InferredProps<T>>> {
}
export interface ValueObjectClassWithTypedConstructor<T extends AnyValueObject = AnyValueObject> extends Class<T, ConstructorParameters<typeof ValueObjectBase<InferredProps<T>>>> {
}
