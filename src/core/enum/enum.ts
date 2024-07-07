import { Class } from "type-fest";
import { ModelBase, Mutable, Prop } from "../../model";
import { ClassStatic } from "../../types";

export type EnumValue = string | number;

export interface EnumProps {
  value: EnumValue;
}

@Mutable(false)
export class EnumBase extends ModelBase<EnumProps> {
  static values() {
    return Array.from(this.ownStaticValues().values()).map(
      (staticValue) => staticValue.value
    );
  }

  static parse<T extends AnyEnum>(
    this: EnumClass<T>,
    providedValue: EnumValue
  ): T {
    let result: T | undefined = undefined;

    this.ownStaticValues().forEach((staticValue) => {
      if (staticValue.value instanceof this) {
        const staticEnum = staticValue.value as T;

        if (staticEnum.value === providedValue && !result) {
          result = staticEnum;
        }
      }
    });

    if (!result)
      throw new Error(`Invalid provided value for enum ${this.modelName()}`);

    return result;
  }

  static parseSafe<T extends AnyEnum>(
    this: EnumClass<T>,
    providedValue: EnumValue
  ): T | null {
    try {
      return this.parse(providedValue);
    } catch (error) {
      return null;
    }
  }

  constructor(value: EnumValue) {
    super();

    this.initializeProps({ value });
  }

  @Prop()
  declare value: EnumValue;
}

export type AnyEnum = EnumBase;

export interface EnumClass<
  T extends AnyEnum = AnyEnum,
  Arguments extends unknown[] = any[]
> extends Class<T, Arguments>,
    ClassStatic<typeof EnumBase> {}

export interface EnumClassWithTypedConstructor<T extends AnyEnum = AnyEnum>
  extends EnumClass<T, ConstructorParameters<typeof EnumBase>> {}
