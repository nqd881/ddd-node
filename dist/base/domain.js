"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.domainManager = exports.DomainManager = exports.DomainMap = exports.Domain = exports.DEFAULT_DOMAIN = void 0;
const model_registry_1 = require("./model-registry");
exports.DEFAULT_DOMAIN = "__default__";
class Domain {
    constructor(name) {
        this.name = name;
        this.modelRegistry = new model_registry_1.ModelRegistry();
    }
}
exports.Domain = Domain;
class DomainMap extends Map {
}
exports.DomainMap = DomainMap;
class DomainManager {
    static instance() {
        if (!this._instance) {
            this._instance = new DomainManager();
            this._instance.addDomain(new Domain(exports.DEFAULT_DOMAIN));
        }
        return this._instance;
    }
    constructor() {
        this._domains = new DomainMap();
    }
    isDefaultDomain(domain) {
        return domain.name === exports.DEFAULT_DOMAIN;
    }
    hasDomain(domainName) {
        return this._domains.has(domainName);
    }
    getDomain(domainName) {
        if (domainName)
            return this._domains.get(domainName);
        if (!domainName)
            return this._domains.get(exports.DEFAULT_DOMAIN);
    }
    addDomain(domain) {
        if (this.hasDomain(domain.name))
            throw new Error(`Domain ${domain.name} has already exist`);
        this._domains.set(domain.name, domain);
    }
    deleteDomain(domainName) {
        this._domains.delete(domainName);
    }
}
exports.DomainManager = DomainManager;
exports.domainManager = DomainManager.instance();
