"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModelMutable = exports.defineModelMutable = void 0;
const ModelMutableMetaKey = Symbol.for("MODEL_MUTABLE");
const defineModelMutable = (target, mutable) => {
    if (Reflect.hasMetadata(ModelMutableMetaKey, target))
        return;
    Reflect.defineMetadata(ModelMutableMetaKey, mutable, target);
};
exports.defineModelMutable = defineModelMutable;
const getModelMutable = (target) => {
    return Reflect.getMetadata(ModelMutableMetaKey, target);
};
exports.getModelMutable = getModelMutable;
