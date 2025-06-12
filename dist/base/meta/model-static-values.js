"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineModelStaticValueProperty = exports.getModelStaticValue = exports.setModelStaticValue = exports.getOwnModelStaticValues = exports.ModelStaticValuesMap = exports.ModelStaticValue = void 0;
class ModelStaticValue {
    constructor(value) {
        this._value = value;
    }
    get value() {
        if (typeof this._value === "function") {
            this._value = this._value();
        }
        return this._value;
    }
}
exports.ModelStaticValue = ModelStaticValue;
const OwnModelStaticValuesMetaKey = Symbol.for("OWN_MODEL_STATIC_VALUES");
class ModelStaticValuesMap extends Map {
}
exports.ModelStaticValuesMap = ModelStaticValuesMap;
const getOwnModelStaticValues = (target) => {
    if (!Reflect.hasOwnMetadata(OwnModelStaticValuesMetaKey, target))
        Reflect.defineMetadata(OwnModelStaticValuesMetaKey, new ModelStaticValuesMap(), target);
    return Reflect.getOwnMetadata(OwnModelStaticValuesMetaKey, target);
};
exports.getOwnModelStaticValues = getOwnModelStaticValues;
const setModelStaticValue = (target, key, value) => {
    const staticValues = (0, exports.getOwnModelStaticValues)(target);
    staticValues.set(key, new ModelStaticValue(value));
};
exports.setModelStaticValue = setModelStaticValue;
const getModelStaticValue = (target, key) => {
    var _a;
    let _target = target;
    do {
        const staticValues = (0, exports.getOwnModelStaticValues)(_target);
        if (staticValues.has(key))
            return (_a = staticValues.get(key)) === null || _a === void 0 ? void 0 : _a.value;
        _target = Reflect.getPrototypeOf(_target);
    } while (_target !== null);
    return undefined;
};
exports.getModelStaticValue = getModelStaticValue;
const defineModelStaticValueProperty = (target, key) => {
    Object.defineProperty(target, key, {
        configurable: false,
        enumerable: true,
        get() {
            return (0, exports.getModelStaticValue)(target, key);
        },
        set() {
            throw new Error("Static value is readonly");
        },
    });
};
exports.defineModelStaticValueProperty = defineModelStaticValueProperty;
