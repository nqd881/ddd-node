import { AnyModel, InferredProps } from "../model";
export declare class ModelPropsMap<T extends AnyModel = AnyModel> extends Map<PropertyKey, keyof InferredProps<T>> {
}
export declare const getOwnModelPropsMap: <T extends AnyModel = AnyModel>(target: object) => ModelPropsMap<T>;
export declare const defineModelProp: <T extends AnyModel = AnyModel>(target: object, key: PropertyKey, propTargetKey?: keyof InferredProps<T> | undefined) => void;
export declare const getModelPropsMap: <T extends AnyModel = AnyModel>(target: object) => ModelPropsMap<T>;
