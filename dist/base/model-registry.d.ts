import { AnyModel, ModelClass } from "./model";
import { ModelId, ModelName, ModelVersion } from "./meta";
export declare class ModelVersionMap<T extends AnyModel = AnyModel> extends Map<ModelVersion, ModelClass<T>> {
    readonly modelName: ModelName;
    constructor(modelName: ModelName);
}
export declare class ModelMap<T extends AnyModel = AnyModel> extends Map<ModelName, ModelVersionMap<T>> {
}
export declare class ModelRegistry {
    private readonly modelMap;
    getModelVersionMap<T extends AnyModel = AnyModel>(modelName: ModelName): ModelVersionMap<T>;
    getModel<T extends AnyModel = AnyModel>(modelName: ModelName, modelVersion?: ModelVersion): ModelClass<T> | undefined;
    getModelByModelId<T extends AnyModel = AnyModel>(modelId: ModelId): ModelClass<T> | undefined;
    hasRegisteredModel(modelName: ModelName, modelVersion: ModelVersion): boolean;
    hasRegisteredModel(model: ModelClass): boolean;
    registerModel(modelClass: ModelClass): this;
}
