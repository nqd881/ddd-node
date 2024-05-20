export class Id {
  private _value: string;

  constructor(idOrValue: Id | string) {
    this._value = idOrValue instanceof Id ? idOrValue.value : idOrValue;
  }

  get value() {
    return this._value;
  }

  equals(id: Id) {
    return id._value === this._value;
  }
}
