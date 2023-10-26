import { Class } from "#types/class";

export class Registry<T extends Class<any>> {
  private _map: Map<string, T>;

  constructor() {
    this._map = new Map();
  }

  hasRegistered(key: string) {
    return this._map.has(key);
  }

  register(key: string, value: T) {
    if (this.hasRegistered(key)) throw new Error(`${key} has been set before`);

    this._map.set(key, value);
  }

  get(key: string) {
    return this._map.get(key);
  }

  getMap() {
    return this._map;
  }
}
