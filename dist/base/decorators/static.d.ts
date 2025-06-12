import { ModelClass } from "../model";
import { ModelStaticValueBuilder } from "../meta";
export declare const Static: <T extends ModelClass<import("../model").AnyModel>, I extends InstanceType<T> = InstanceType<T>>(builder: ModelStaticValueBuilder<I>) => (target: T, key: PropertyKey) => void;
