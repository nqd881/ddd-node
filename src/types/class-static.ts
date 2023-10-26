import { Class } from "./class";

export type ClassStatic<T extends Class<any>> = Omit<
  T,
  "constructor" | "prototype"
>;
