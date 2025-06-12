"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModelPropsMap = exports.defineModelProp = exports.getOwnModelPropsMap = exports.ModelPropsMap = void 0;
const model_1 = require("../model");
const OwnModelPropsMapMetaKey = Symbol.for("OWN_MODEL_PROPS_MAP");
class ModelPropsMap extends Map {
}
exports.ModelPropsMap = ModelPropsMap;
// target is prototype
const getOwnModelPropsMap = (target) => {
    if (!Reflect.hasOwnMetadata(OwnModelPropsMapMetaKey, target))
        Reflect.defineMetadata(OwnModelPropsMapMetaKey, new ModelPropsMap(), target);
    return Reflect.getOwnMetadata(OwnModelPropsMapMetaKey, target);
};
exports.getOwnModelPropsMap = getOwnModelPropsMap;
const defineModelProp = (target, key, propTargetKey) => {
    const ownModelPropsMap = (0, exports.getOwnModelPropsMap)(target);
    if (propTargetKey)
        ownModelPropsMap.set(key, propTargetKey);
};
exports.defineModelProp = defineModelProp;
const ModelPropsMapMetaKey = Symbol.for("MODEL_PROPS_MAP");
const getModelPropsMap = (target) => {
    if (!Reflect.hasOwnMetadata(ModelPropsMapMetaKey, target)) {
        const buildPropsMap = (target) => {
            let _target = target;
            const result = new ModelPropsMap();
            const ownPropsMapList = [];
            do {
                if (model_1.ModelBase.isModel(_target)) {
                    const ownModelPropsMap = (0, exports.getOwnModelPropsMap)(_target);
                    ownPropsMapList.unshift(ownModelPropsMap);
                }
                _target = Reflect.getPrototypeOf(_target);
            } while (_target !== null);
            ownPropsMapList.forEach((ownModelPropsMap) => {
                ownModelPropsMap.forEach((targetPropKey, key) => result.set(key, targetPropKey));
            });
            return result;
        };
        Reflect.defineMetadata(ModelPropsMapMetaKey, buildPropsMap(target), target);
    }
    return Reflect.getOwnMetadata(ModelPropsMapMetaKey, target);
};
exports.getModelPropsMap = getModelPropsMap;
