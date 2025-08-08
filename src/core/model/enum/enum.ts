import { Class } from "type-fest";
import { DomainModel, Mutable, Prop } from "../../../base";
import { ClassStatic } from "../../../types";

export type EnumValue = string | number;

export interface EnumProps {
  value: EnumValue;
}

@Mutable(false)
export class Enum extends DomainModel<EnumProps> {
  static values() {
    return Array.from(
      this.modelDescriptor().ownModelStaticValues().values()
    ).map((staticValue) => staticValue.value);
  }

  static from<T extends AnyEnum>(this: EnumClass<T>, value: EnumValue): T {
    if (!value) throw new Error("Cannot parse enum without value");

    let result: T | undefined;

    this.modelDescriptor()
      .ownModelStaticValues()
      .forEach((staticValue) => {
        if (staticValue.value instanceof this) {
          const staticEnum = staticValue.value as T;

          if (staticEnum.value === value && !result) {
            result = staticEnum;
          }
        }
      });

    if (!result)
      throw new Error(
        `Invalid provided value for enum ${this.modelDescriptor().modelName()}`
      );

    return result;
  }

  constructor(value: EnumValue) {
    super();

    this.initializeProps({ value });
  }

  @Prop()
  declare value: EnumValue;

  valueOf() {
    return this.value;
  }
}

export type AnyEnum = Enum;

export interface EnumClass<
  T extends AnyEnum = AnyEnum,
  Arguments extends unknown[] = any[]
> extends Class<T, Arguments>,
    ClassStatic<typeof Enum> {}

export interface EnumClassWithTypedConstructor<T extends AnyEnum = AnyEnum>
  extends EnumClass<T, ConstructorParameters<typeof Enum>> {}
