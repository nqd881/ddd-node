import { AnyClass } from "./class";
export type ClassStatic<T extends AnyClass<any>> = Omit<T, "constructor" | "prototype">;
