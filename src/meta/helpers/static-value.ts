import { AnyModel } from "../../core";

export type StaticValueBuilder<T extends AnyModel = AnyModel> = () => T;

export class StaticValue<T extends AnyModel = AnyModel> {
  private _value: T | StaticValueBuilder<T>;

  constructor(value: T | StaticValueBuilder<T>) {
    this._value = value;
  }

  get value() {
    if (typeof this._value === "function") {
      this._value = this._value();
    }

    return this._value;
  }
}
