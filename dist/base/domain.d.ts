import { ModelRegistry } from "./model-registry";
export type DomainName = string;
export declare const DEFAULT_DOMAIN = "__default__";
export declare class Domain {
    readonly name: DomainName;
    readonly modelRegistry: ModelRegistry;
    constructor(name: DomainName);
}
export declare class DomainMap extends Map<DomainName, Domain> {
}
export declare class DomainManager {
    static _instance: DomainManager;
    static instance(): DomainManager;
    private constructor();
    private _domains;
    isDefaultDomain(domain: Domain): boolean;
    hasDomain(domainName: DomainName): boolean;
    getDomain(): Domain;
    getDomain(domainName: typeof DEFAULT_DOMAIN): Domain;
    getDomain(domainName: DomainName): Domain | undefined;
    addDomain(domain: Domain): void;
    deleteDomain(domainName: DomainName): void;
}
export declare const domainManager: DomainManager;
