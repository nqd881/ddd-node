import { AnyModel, ModelClass } from "../model";
export type ModelVersion = number;
export declare class $ModelVersion extends Number {
    static validate(modelVersion: ModelVersion): void;
    constructor(modelVersion: ModelVersion);
}
export declare const defineModelVersion: <T extends AnyModel>(target: ModelClass<T>, modelVersion: ModelVersion) => void;
export declare const getModelVersion: <T extends AnyModel>(target: ModelClass<T>) => ModelVersion;
