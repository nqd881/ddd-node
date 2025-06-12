"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelBase = void 0;
const lodash_1 = __importDefault(require("lodash"));
const meta_1 = require("../meta");
const errors_1 = require("./errors");
class ModelBase {
    static isModel(model) {
        return model instanceof ModelBase;
    }
    static modelMutable() {
        var _a;
        return (_a = (0, meta_1.getModelMutable)(this)) !== null && _a !== void 0 ? _a : false;
    }
    static modelName() {
        return (0, meta_1.getModelName)(this);
    }
    static modelVersion() {
        return (0, meta_1.getModelVersion)(this);
    }
    static modelId() {
        return (0, meta_1.getModelId)(this);
    }
    static ownModelPropsValidator() {
        return (0, meta_1.getOwnModelPropsValidator)(this);
    }
    static modelPropsValidators() {
        return (0, meta_1.getModelPropsValidators)(this);
    }
    static ownModelStaticValues() {
        return (0, meta_1.getOwnModelStaticValues)(this);
    }
    static ownModelPropsMap() {
        return (0, meta_1.getOwnModelPropsMap)(this.prototype);
    }
    static modelPropsMap() {
        return (0, meta_1.getModelPropsMap)(this.prototype);
    }
    constructor() {
        this._props = ModelBase.EMPTY_PROPS;
        this.redefineModel();
    }
    redefineModel() {
        this.modelDescriptor().modelPropsMap.forEach((propTargetKey, key) => {
            this.redefineProp(key, propTargetKey);
        });
    }
    redefineProp(key, propTargetKey) {
        Object.defineProperty(this, key, {
            // must be true because the props() method need to recall redefineModel(-> redefineProp)
            configurable: true,
            enumerable: true,
            get() {
                var _a;
                return (_a = this._props) === null || _a === void 0 ? void 0 : _a[propTargetKey];
            },
        });
    }
    modelDescriptor() {
        const modelClass = this.constructor;
        return {
            modelMutable: modelClass.modelMutable(),
            modelId: modelClass.modelId(),
            modelName: modelClass.modelName(),
            modelVersion: modelClass.modelVersion(),
            ownModelPropsValidator: modelClass.ownModelPropsValidator(),
            modelPropsValidators: modelClass.modelPropsValidators(),
            ownModelStaticValues: modelClass.ownModelStaticValues(),
            ownModelPropsMap: modelClass.ownModelPropsMap(),
            modelPropsMap: modelClass.modelPropsMap(),
        };
    }
    validateProps(props) {
        const modelPropsValidators = this.modelDescriptor().modelPropsValidators;
        modelPropsValidators.forEach((propsValidator) => propsValidator.call(this.constructor, props));
    }
    validate() {
        this.validateProps(this._props);
    }
    propsIsEmpty() {
        return this._props === ModelBase.EMPTY_PROPS;
    }
    props() {
        if (this.propsIsEmpty())
            return null;
        return lodash_1.default.cloneDeepWith(this._props, (value) => {
            if (ModelBase.isModel(value)) {
                value.redefineModel();
                return value;
            }
        });
    }
    metadata() {
        return {};
    }
    initializeProps(props) {
        if (!this.propsIsEmpty())
            throw new errors_1.PropsInitializedError();
        if (!this.modelDescriptor().modelMutable) {
            this._props = props;
            Object.freeze(this._props);
        }
        else {
            this._props = new Proxy(props, {
                set: (target, propKey, value) => {
                    let result = Reflect.set(target, propKey, value);
                    this.validate();
                    return result;
                },
            });
        }
        this.validate();
    }
}
exports.ModelBase = ModelBase;
ModelBase.EMPTY_PROPS = {};
