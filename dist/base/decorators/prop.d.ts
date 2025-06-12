import { AnyModel, InferredProps } from "../model";
export declare const Prop: <T extends AnyModel>(propTargetKey?: keyof InferredProps<T> | undefined) => (target: T, key: PropertyKey) => void;
