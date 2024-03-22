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

export abstract class IdGenerator {
  abstract generateValue(): string;

  abstract validateValue(value: string): void;

  fromValue(value: string) {
    this.validateValue(value);

    return new Id(value);
  }

  fromId(id: Id) {
    return this.fromValue(id.value);
  }

  newId(): Id {
    return this.fromValue(this.generateValue());
  }
}

export class Uuid4Generator extends IdGenerator {
  generateValue() {
    return v4();
  }

  validateValue(value: string) {
    const isUuid = validate(value);
    const isV4 = version(value) === 4;

    return isUuid && isV4;
  }
}
