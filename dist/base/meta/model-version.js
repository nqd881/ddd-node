"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModelVersion = exports.defineModelVersion = exports.$ModelVersion = void 0;
class $ModelVersion extends Number {
    static validate(modelVersion) {
        if (modelVersion < 0 && Number.isInteger(modelVersion))
            throw new Error("Model version must be a non-negative integer number");
    }
    constructor(modelVersion) {
        $ModelVersion.validate(modelVersion);
        super(modelVersion);
    }
}
exports.$ModelVersion = $ModelVersion;
const ModelVersionMetaKey = Symbol.for("MODEL_VERSION");
const defineModelVersion = (target, modelVersion) => {
    Reflect.defineMetadata(ModelVersionMetaKey, new $ModelVersion(modelVersion), target);
};
exports.defineModelVersion = defineModelVersion;
const getModelVersion = (target) => {
    if (!Reflect.hasOwnMetadata(ModelVersionMetaKey, target))
        (0, exports.defineModelVersion)(target, 0);
    return Reflect.getOwnMetadata(ModelVersionMetaKey, target).valueOf();
};
exports.getModelVersion = getModelVersion;
