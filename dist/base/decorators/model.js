"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = exports.DEFAULT_MODEL_OPTIONS = void 0;
const lodash_1 = __importDefault(require("lodash"));
const domain_1 = require("../domain");
const meta_1 = require("../meta");
exports.DEFAULT_MODEL_OPTIONS = {
    autoRegisterModel: true,
};
function Model(p1, p2, p3) {
    const defaultModelOptions = lodash_1.default.clone(exports.DEFAULT_MODEL_OPTIONS);
    let modelOptions = {};
    if (p1 && !p2 && !p3) {
        if (typeof p1 === "string")
            modelOptions = { name: p1 };
        else
            modelOptions = p1;
    }
    else if (p1 && p2 && !p3) {
        if (typeof p2 === "number")
            modelOptions = { name: p1, version: p2 };
        else
            modelOptions = Object.assign({ name: p1 }, p2);
    }
    else if (p1 && p2 && p3) {
        modelOptions = Object.assign({ name: p1, version: p2 }, p3);
    }
    modelOptions = lodash_1.default.merge(defaultModelOptions, modelOptions);
    return (target) => {
        if (modelOptions === null || modelOptions === void 0 ? void 0 : modelOptions.name)
            (0, meta_1.defineModelName)(target, modelOptions.name);
        if (modelOptions === null || modelOptions === void 0 ? void 0 : modelOptions.version)
            (0, meta_1.defineModelVersion)(target, modelOptions.version);
        if (modelOptions === null || modelOptions === void 0 ? void 0 : modelOptions.domain)
            (0, meta_1.defineModelDomain)(target, modelOptions.domain);
        if (modelOptions === null || modelOptions === void 0 ? void 0 : modelOptions.autoRegisterModel) {
            const domainName = (0, meta_1.getModelDomain)(target);
            const domainManager = domain_1.DomainManager.instance();
            if (!domainManager.hasDomain(domainName)) {
                domainManager.addDomain(new domain_1.Domain(domainName));
            }
            const domain = domainManager.getDomain(domainName);
            domain.modelRegistry.registerModel(target);
        }
        if (modelOptions === null || modelOptions === void 0 ? void 0 : modelOptions.propsValidator)
            (0, meta_1.defineModelPropsValidator)(target, modelOptions.propsValidator);
    };
}
exports.Model = Model;
