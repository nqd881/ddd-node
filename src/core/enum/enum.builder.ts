import { ModelBuilder } from "../../model";
import { AnyEnum, EnumClassWithTypedConstructor, EnumValue } from "./enum";

export class EnumBuilder<T extends AnyEnum> extends ModelBuilder<T> {
  protected _value: EnumValue;

  constructor(private enumClass: EnumClassWithTypedConstructor<T>) {
    super();
  }

  withValue(value: EnumValue) {
    this._value = value;

    return this;
  }

  build() {
    if (!this._value) throw new Error("The value must be set before build");

    return this.enumClass.parse(this._value);
  }
}
