import { Static } from "../../../base";
import {
  EnumClassWithTypedConstructor,
  EnumProperty,
  EnumValue,
  markEnumProperty,
} from "../../../core";

export const IsEnum = (value?: EnumValue) => {
  return <T extends EnumClassWithTypedConstructor>(
    target: T,
    key: EnumProperty<T>
  ) => {
    markEnumProperty(target, key);

    const enumBuilder = () => new target(value ?? key);

    Static(enumBuilder)(target, key);
  };
};
