import { EnumClass, EnumValue } from "../core";
import { Static } from "./model/static";

export const Enum = (value: EnumValue) => {
  return <T extends EnumClass>(target: T, key: string) => {
    Static(() => new target(value))(target, key);
  };
};
