"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModelDomain = exports.defineModelDomain = exports.ModelDomainMetaKey = void 0;
const domain_1 = require("../domain");
exports.ModelDomainMetaKey = Symbol.for("MODEL_DOMAIN");
const defineModelDomain = (target, domainName) => {
    Reflect.defineMetadata(exports.ModelDomainMetaKey, domainName, target);
};
exports.defineModelDomain = defineModelDomain;
const getModelDomain = (target) => {
    if (!Reflect.hasOwnMetadata(exports.ModelDomainMetaKey, target))
        (0, exports.defineModelDomain)(target, domain_1.DEFAULT_DOMAIN);
    return Reflect.getOwnMetadata(exports.ModelDomainMetaKey, target);
};
exports.getModelDomain = getModelDomain;
