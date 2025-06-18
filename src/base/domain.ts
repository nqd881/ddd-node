import { ModelRegistry } from "./model-registry";

export type DomainName = string;

export const DEFAULT_DOMAIN = "__default__";

export class Domain {
  public readonly modelRegistry: ModelRegistry = new ModelRegistry();

  constructor(public readonly name: DomainName) {}
}

export class DomainMap extends Map<DomainName, Domain> {}

export class DomainManager {
  private static _instance: DomainManager;

  static instance() {
    if (!this._instance) {
      this._instance = new DomainManager();

      this._instance.addDomain(new Domain(DEFAULT_DOMAIN));
    }

    return this._instance;
  }

  private constructor() {}

  private _domains: DomainMap = new DomainMap();

  isDefaultDomain(domain: Domain) {
    return domain.name === DEFAULT_DOMAIN;
  }

  hasDomain(domainName: DomainName) {
    return this._domains.has(domainName);
  }

  getDomain(domainName?: DomainName): Domain {
    if (domainName) {
      if (!this.hasDomain(domainName)) this.addDomain(new Domain(domainName));

      return this._domains.get(domainName)!;
    }

    return this.getDomain(DEFAULT_DOMAIN);
  }

  addDomain(domain: Domain) {
    if (this.hasDomain(domain.name))
      throw new Error(`Domain ${domain.name} has already exist`);

    this._domains.set(domain.name, domain);
  }

  deleteDomain(domainName: DomainName) {
    this._domains.delete(domainName);
  }
}

export const domainManager = DomainManager.instance();
