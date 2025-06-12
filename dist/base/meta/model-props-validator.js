"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModelPropsValidators = exports.ModelPropsValidatorsMetaKey = exports.getOwnModelPropsValidator = exports.defineModelPropsValidator = void 0;
const lodash_1 = __importDefault(require("lodash"));
const OwnPropsValidatorMetaKey = Symbol.for("OWN_MODEL_PROPS_VALIDATOR");
const defineModelPropsValidator = (target, validator) => {
    Reflect.defineMetadata(OwnPropsValidatorMetaKey, validator, target);
};
exports.defineModelPropsValidator = defineModelPropsValidator;
const getOwnModelPropsValidator = (target) => {
    return Reflect.getOwnMetadata(OwnPropsValidatorMetaKey, target);
};
exports.getOwnModelPropsValidator = getOwnModelPropsValidator;
exports.ModelPropsValidatorsMetaKey = Symbol.for("MODEL_PROPS_VALIDATORS");
const getModelPropsValidators = (target) => {
    if (!Reflect.hasOwnMetadata(exports.ModelPropsValidatorsMetaKey, target)) {
        let result = [];
        let _target = target;
        do {
            const ownValidator = (0, exports.getOwnModelPropsValidator)(_target);
            if (ownValidator)
                result.push(ownValidator);
            _target = Reflect.getPrototypeOf(_target);
        } while (_target !== null);
        result = lodash_1.default.uniq(result);
        Reflect.defineMetadata(exports.ModelPropsValidatorsMetaKey, result, target);
    }
    return Reflect.getOwnMetadata(exports.ModelPropsValidatorsMetaKey, target);
};
exports.getModelPropsValidators = getModelPropsValidators;
