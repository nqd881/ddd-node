import { v4, validate, version } from "uuid";

export class Id {
  private _value: string;

  constructor(value: string) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  equals(id: Id) {
    return this._value === id._value;
  }
}

export class Uuid4 extends Id {
  private constructor(value: string) {
    super(value);
  }

  static new() {
    const newValue = v4();

    return this.from(newValue);
  }

  static from(value: string) {
    this.validate(value);

    return new Uuid4(value);
  }

  static validate(value: string) {
    const isUuid = validate(value);
    const isV4 = version(value) === 4;

    return isUuid && isV4;
  }
}
