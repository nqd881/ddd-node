import { v4, validate, version } from "uuid";

export class Id {
  private _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static unique() {
    const value = v4();

    return new Id(value);
  }

  static from(value: string) {
    const isUUID4 = validate(value) && version(value) === 4;

    if (!isUUID4) throw new Error("Invalid uuid version 4 value");

    return new Id(value);
  }

  get value() {
    return this._value;
  }

  equals(id: Id) {
    return this._value === id._value;
  }
}
