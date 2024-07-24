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
