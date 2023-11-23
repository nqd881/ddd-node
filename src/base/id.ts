import { v4 } from "uuid";

export class Id {
  private _value: string;

  constructor(value: string) {
    this._value = value;
  }

  static unique() {
    const value = v4();

    return new Id(value);
  }

  get value() {
    return this._value;
  }

  equals(id: Id) {
    return this._value === id._value;
  }
}
