import { AnyModel, ModelClass } from "../model";
export type ModelName = string;
export declare class $ModelName extends String {
    static validate(modelName: ModelName): void;
    constructor(modelName: ModelName);
}
export declare const defineModelName: <T extends AnyModel>(target: ModelClass<T>, modelName: ModelName) => void;
export declare const getModelName: <T extends AnyModel>(target: ModelClass<T>) => ModelName;
