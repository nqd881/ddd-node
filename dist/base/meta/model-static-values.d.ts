import { AnyModel, ModelClass } from "../model";
export type ModelStaticValueBuilder<T extends AnyModel = AnyModel> = () => T;
export declare class ModelStaticValue<T extends AnyModel = AnyModel> {
    private _value;
    constructor(value: T | ModelStaticValueBuilder<T>);
    get value(): T;
}
export declare class ModelStaticValuesMap<T extends AnyModel = AnyModel> extends Map<PropertyKey, ModelStaticValue<T>> {
}
export declare const getOwnModelStaticValues: <T extends AnyModel>(target: object) => ModelStaticValuesMap<T>;
export declare const setModelStaticValue: <T extends AnyModel>(target: object, key: PropertyKey, value: T | ModelStaticValueBuilder<T>) => void;
export declare const getModelStaticValue: (target: object, key: PropertyKey) => AnyModel | undefined;
export declare const defineModelStaticValueProperty: (target: ModelClass, key: PropertyKey) => void;
