"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModelId = exports.setModelId = exports.$ModelId = void 0;
const model_name_1 = require("./model-name");
const model_version_1 = require("./model-version");
class $ModelId extends String {
    static fromValue(value) {
        if (!this.Format.test(value))
            throw new Error(`Cannot parse $ModelId from value ${value}`);
        const [modelName, modelVersion] = value.split(this.Divider);
        return new $ModelId(modelName, Number(modelVersion));
    }
    static makeValue(modelName, modelVersion) {
        const modelId = `${modelName}${this.Divider}${modelVersion}`;
        return modelId;
    }
    constructor(modelName, modelVersion) {
        super($ModelId.makeValue(modelName, modelVersion));
        this.modelName = modelName;
        this.modelVersion = modelVersion;
    }
}
exports.$ModelId = $ModelId;
$ModelId.Divider = "|";
$ModelId.Format = new RegExp(/^.+\|[0-9]+$/);
const ModelIdMetaKey = Symbol.for("MODEL_ID");
const setModelId = (target, modelId) => {
    Reflect.defineMetadata(ModelIdMetaKey, modelId, target);
};
exports.setModelId = setModelId;
const getModelId = (target) => {
    if (!Reflect.hasOwnMetadata(ModelIdMetaKey, target)) {
        const modelName = (0, model_name_1.getModelName)(target);
        const modelVersion = (0, model_version_1.getModelVersion)(target);
        (0, exports.setModelId)(target, new $ModelId(modelName, modelVersion));
    }
    return Reflect.getOwnMetadata(ModelIdMetaKey, target).valueOf();
};
exports.getModelId = getModelId;
