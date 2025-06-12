import { ModelBuilder } from "../../base";
import { AnyValueObject, ValueObjectClassWithTypedConstructor } from "./value-object";
export declare class ValueObjectBuilder<T extends AnyValueObject> extends ModelBuilder<T> {
    private valueObjectClass;
    constructor(valueObjectClass: ValueObjectClassWithTypedConstructor<T>);
    build(): T;
}
