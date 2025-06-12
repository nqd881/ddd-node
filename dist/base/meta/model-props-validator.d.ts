import { AnyModel, InferredProps } from "../model";
export type ModelPropsValidator<T extends AnyModel = AnyModel> = (props: InferredProps<T>) => void;
export declare const defineModelPropsValidator: <T extends AnyModel>(target: object, validator: ModelPropsValidator<T>) => void;
export declare const getOwnModelPropsValidator: <T extends AnyModel>(target: object) => ModelPropsValidator<T> | undefined;
export declare const ModelPropsValidatorsMetaKey: unique symbol;
export declare const getModelPropsValidators: (target: object) => ModelPropsValidator[];
