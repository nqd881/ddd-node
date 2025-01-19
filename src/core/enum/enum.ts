import { Class } from "type-fest";
import { ModelBase, Mutable, Prop } from "../../base";
import { ClassStatic } from "../../types";
import { EnumBuilder } from ".";

export type EnumValue = string | number;

export interface EnumProps {
  value: EnumValue;
}

@Mutable(false)
export class EnumBase extends ModelBase<EnumProps> {
  static builder<T extends AnyEnum>(this: EnumClass<T>): EnumBuilder<T> {
    return new EnumBuilder(this);
  }

  static values() {
    return Array.from(this.ownStaticValues().values()).map(
      (staticValue) => staticValue.value
    );
  }

  static from<T extends AnyEnum>(this: EnumClass<T>, value: EnumValue): T {
    return this.builder().withValue(value).build();
  }

  static fromSafe<T extends AnyEnum>(
    this: EnumClass<T>,
    value: EnumValue
  ): T | null {
    return this.builder().withValue(value).buildSafe();
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

export type AnyEnum = EnumBase;

export interface EnumClass<
  T extends AnyEnum = AnyEnum,
  Arguments extends unknown[] = any[]
> extends Class<T, Arguments>,
    ClassStatic<typeof EnumBase> {}

export interface EnumClassWithTypedConstructor<T extends AnyEnum = AnyEnum>
  extends EnumClass<T, ConstructorParameters<typeof EnumBase>> {}
