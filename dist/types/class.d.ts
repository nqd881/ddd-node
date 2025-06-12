import { AbstractClass, Class } from "type-fest";
export type AnyClass<T = any> = Class<T> | AbstractClass<T>;
