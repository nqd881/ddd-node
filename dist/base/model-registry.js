"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelRegistry = exports.ModelMap = exports.ModelVersionMap = void 0;
const meta_1 = require("./meta");
class ModelVersionMap extends Map {
    constructor(modelName) {
        super();
        this.modelName = modelName;
    }
}
exports.ModelVersionMap = ModelVersionMap;
class ModelMap extends Map {
}
exports.ModelMap = ModelMap;
class ModelRegistry {
    constructor() {
        this.modelMap = new ModelMap();
    }
    getModelVersionMap(modelName) {
        const modelVersionMap = () => this.modelMap.get(modelName);
        if (!modelVersionMap())
            this.modelMap.set(modelName, new ModelVersionMap(modelName));
        return modelVersionMap();
    }
    getModel(modelName, modelVersion = 0) {
        const modelVersionMap = this.getModelVersionMap(modelName);
        return modelVersionMap.get(modelVersion);
    }
    getModelByModelId(modelId) {
        const { modelName, modelVersion } = meta_1.$ModelId.fromValue(modelId);
        return this.getModel(modelName, modelVersion);
    }
    hasRegisteredModel(p1, p2) {
        let modelName, modelVersion;
        if (typeof p1 === "string") {
            modelName = p1;
            modelVersion = p2;
        }
        else {
            modelName = p1.modelName();
            modelVersion = p1.modelVersion();
        }
        return Boolean(this.getModel(modelName, modelVersion));
    }
    registerModel(modelClass) {
        const modelName = modelClass.modelName();
        const modelVersion = modelClass.modelVersion();
        if (this.hasRegisteredModel(modelName, modelVersion))
            throw new Error(`Model ${modelName} with version ${modelVersion} has been registered`);
        const modelVersionMap = this.getModelVersionMap(modelName);
        modelVersionMap.set(modelVersion, modelClass);
        return this;
    }
}
exports.ModelRegistry = ModelRegistry;
