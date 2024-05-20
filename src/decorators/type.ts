import { Class } from "type-fest";

export type TypedClassDecorator<T extends Class<any> = Class<any>> = (
  target: T
) => T | void;
