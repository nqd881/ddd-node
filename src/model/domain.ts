import { ModelRegistry } from "./model-registry";

export type DomainName = string;

export class Domain {
  public readonly modelRegistry: ModelRegistry = new ModelRegistry();

  constructor(public readonly name: DomainName) {}
}

export class DomainMap extends Map<DomainName, Domain> {}

export class DomainManager {
  static _instance: DomainManager;

  static instance() {
    if (!this._instance) this._instance = new DomainManager();

    return this._instance;
  }

  private constructor() {}

  private _domains: DomainMap = new DomainMap();

  hasDomain(domainName: DomainName) {
    return this._domains.has(domainName);
  }

  getDomain(domainName: DomainName) {
    return this._domains.get(domainName);
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
