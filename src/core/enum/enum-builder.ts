import { ModelBuilder } from "../../base";
import { AnyEnum, EnumClass, EnumValue } from "./enum";

export class EnumBuilder<T extends AnyEnum> extends ModelBuilder<T> {
  protected _value?: EnumValue;

  constructor(private enumClass: EnumClass<T>) {
    super();
  }

  withValue(value: EnumValue) {
    this._value = value;
    return this;
  }

  build() {
    if (!this._value) throw new Error("Cannot parse enum without value");

    const { enumClass } = this;

    let result: T | undefined;

    enumClass.ownStaticValues().forEach((staticValue) => {
      if (staticValue.value instanceof enumClass) {
        const staticEnum = staticValue.value as T;

        if (staticEnum.value === this._value && !result) {
          result = staticEnum;
        }
      }
    });

    if (!result)
      throw new Error(
        `Invalid provided value for enum ${enumClass.modelName()}`
      );

    return result;
  }
}
