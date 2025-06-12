"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModelName = exports.defineModelName = exports.$ModelName = void 0;
class $ModelName extends String {
    static validate(modelName) {
        if (modelName.trim().length === 0)
            throw new Error("Model name cannot be an empty string");
    }
    constructor(modelName) {
        $ModelName.validate(modelName);
        super(modelName);
    }
}
exports.$ModelName = $ModelName;
const ModelNameMetaKey = Symbol.for("MODEL_NAME");
const defineModelName = (target, modelName) => {
    Reflect.defineMetadata(ModelNameMetaKey, new $ModelName(modelName), target);
};
exports.defineModelName = defineModelName;
const getModelName = (target) => {
    if (!Reflect.hasOwnMetadata(ModelNameMetaKey, target))
        (0, exports.defineModelName)(target, target.name);
    return Reflect.getOwnMetadata(ModelNameMetaKey, target).valueOf();
};
exports.getModelName = getModelName;
