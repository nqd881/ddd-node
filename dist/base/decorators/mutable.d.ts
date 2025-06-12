import { AbstractModelClass, ModelClass } from "../model";
export declare const Mutable: (mutable?: boolean) => <T extends ModelClass<import("../model").AnyModel> | AbstractModelClass<import("../model").AnyModel>>(target: T) => void;
