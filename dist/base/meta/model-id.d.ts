import { AnyModel, ModelClass } from "../model";
import { ModelName } from "./model-name";
import { ModelVersion } from "./model-version";
export type ModelId = string;
export type ModelIdFormat = `${string}${typeof $ModelId.Divider}${number}`;
export declare class $ModelId extends String {
    readonly modelName: ModelName;
    readonly modelVersion: ModelVersion;
    static Divider: "|";
    static Format: RegExp;
    static fromValue(value: ModelId): $ModelId;
    static makeValue(modelName: ModelName, modelVersion: ModelVersion): ModelId;
    constructor(modelName: ModelName, modelVersion: ModelVersion);
}
export declare const setModelId: <T extends AnyModel>(target: ModelClass<T>, modelId: $ModelId) => void;
export declare const getModelId: <T extends AnyModel>(target: ModelClass<T>) => ModelId;
