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
