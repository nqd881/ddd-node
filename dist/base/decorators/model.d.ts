import { ModelPropsValidator } from "../meta";
import { AnyModel, ModelClass } from "../model";
export type ModelOptions<T extends AnyModel = AnyModel> = {
    name?: string;
    version?: number;
    domain?: string;
    propsValidator?: ModelPropsValidator<T>;
    autoRegisterModel?: boolean;
};
export declare const DEFAULT_MODEL_OPTIONS: ModelOptions;
export declare function Model<T extends ModelClass, I extends InstanceType<T> = InstanceType<T>>(options?: ModelOptions<I>): any;
export declare function Model<T extends ModelClass, I extends InstanceType<T> = InstanceType<T>>(name: string, options?: ModelOptions<I>): any;
export declare function Model<T extends ModelClass, I extends InstanceType<T> = InstanceType<T>>(name: string, version: number, options?: ModelOptions<I>): any;
