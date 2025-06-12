import { Class } from "type-fest";
import { ModelBase } from "../../base";
import { ClassStatic } from "../../types";
import { EnumBuilder } from ".";
export type EnumValue = string | number;
export interface EnumProps {
    value: EnumValue;
}
export declare class EnumBase extends ModelBase<EnumProps> {
    static builder<T extends AnyEnum>(this: EnumClass<T>): EnumBuilder<T>;
    static values(): EnumBase[];
    static from<T extends AnyEnum>(this: EnumClass<T>, value: EnumValue): T;
    static fromSafe<T extends AnyEnum>(this: EnumClass<T>, value: EnumValue): T | null;
    constructor(value: EnumValue);
    value: EnumValue;
    valueOf(): EnumValue;
}
export type AnyEnum = EnumBase;
export interface EnumClass<T extends AnyEnum = AnyEnum, Arguments extends unknown[] = any[]> extends Class<T, Arguments>, ClassStatic<typeof EnumBase> {
}
export interface EnumClassWithTypedConstructor<T extends AnyEnum = AnyEnum> extends EnumClass<T, ConstructorParameters<typeof EnumBase>> {
}
