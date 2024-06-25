import { Class } from "type-fest";
import { ModelBase, Mutable } from "../model";
import { ClassStatic } from "../types";

export type EnumValue = string | number;

export interface EnumProps {
  value: EnumValue;
}

@Mutable(false)
export class EnumBase extends ModelBase<EnumProps> {
  static values() {
    return Array.from(this.modelMetadata().ownStaticValues().values()).map(
      (staticValue) => staticValue.value
    );
  }

  static parseSafe<T extends EnumBase>(
    this: EnumClass<T>,
    providedValue: EnumValue
  ): T | undefined {
    let key: PropertyKey | undefined = undefined;

    this.modelMetadata()
      .ownStaticValues()
      .forEach((staticValue, staticValueKey) => {
        if (staticValue.value instanceof this) {
          const staticEnum = staticValue.value as T;

          if (staticEnum.value === providedValue && !key) {
            key = staticValueKey;
          }
        }
      });

    if (key) return this.modelMetadata().ownStaticValues().get(key)?.value;

    return undefined;
  }

  static parse<T extends EnumBase>(
    this: EnumClass<T>,
    providedValue: EnumValue
  ): T {
    const parsedEnum = this.parseSafe(providedValue);

    if (!parsedEnum)
      throw new Error(
        `Invalid provided value for enum ${this.modelMetadata().modelName()}`
      );

    return parsedEnum;
  }

  constructor(value: EnumValue) {
    super();

    this.initializeProps({ value });
  }

  override props() {
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
