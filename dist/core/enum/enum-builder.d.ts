import { ModelBuilder } from "../../base";
import { AnyEnum, EnumClass, EnumValue } from "./enum";
export declare class EnumBuilder<T extends AnyEnum> extends ModelBuilder<T> {
    private enumClass;
    protected _value?: EnumValue;
    constructor(enumClass: EnumClass<T>);
    withValue(value: EnumValue): this;
    build(): T;
}
