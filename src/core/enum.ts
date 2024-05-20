import { ClassStatic } from "../types";
import { Class } from "type-fest";
import { ModelBase } from "./model";

export type EnumValue = string | number;

export interface EnumProps {
  value: EnumValue;
}

export class EnumBase extends ModelBase<EnumProps> {
  static values() {
    return Array.from(this.ownStaticValues().values()).map(
      (staticValue) => staticValue.value
    );
  }

  static parseSafe<T extends EnumBase>(
    this: EnumClass<T>,
    providedValue: EnumValue
  ): T | undefined {
    let key: string | symbol | undefined;

    this.ownStaticValues().forEach((staticValue, staticValueKey) => {
      if (staticValue.value instanceof this) {
        const staticEnum = staticValue.value as T;

        if (staticEnum.value === providedValue && !key) {
          key = staticValueKey;
        }
      }
    });

    if (key) return this.ownStaticValues().get(key)?.value;

    return undefined;
  }

  static parse<T extends EnumBase>(
    this: EnumClass<T>,
    providedValue: EnumValue
  ): T {
    const parsedEnum = this.parseSafe(providedValue);

    if (!parsedEnum)
      throw new Error(`Invalid provided value for enum ${this.modelName()}`);

    return parsedEnum;
  }

  constructor(value: EnumValue) {
    super();

    this.initializeProps({ value });
  }

  override props(): EnumProps {
    return super.props()!;
  }

  get value() {
    return this._props.value;
  }

  equals<T extends EnumBase>(other: T) {
    const equalType = other instanceof this.constructor;
    const equalValue = other.value === this.value;

    return equalType && equalValue;
  }
}

export interface EnumClass<T extends EnumBase = EnumBase>
  extends Class<T>,
    ClassStatic<typeof EnumBase> {}
