import { EnumClass, EnumValue } from "../core";
export declare const Enum: (value?: EnumValue) => <T extends EnumClass<import("../core").EnumBase, any[]>>(target: T, key: string) => void;
