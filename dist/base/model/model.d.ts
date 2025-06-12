import { AbstractClass, Class } from "type-fest";
import { ClassStatic } from "../../types";
import { ModelId, ModelName, ModelPropsMap, ModelPropsValidator, ModelStaticValuesMap, ModelVersion } from "../meta";
import { ModelDescriptor } from "./model-descriptor";
export interface Props {
    [key: PropertyKey]: any;
}
export type EmptyProps = {
    [key: PropertyKey]: never;
};
export declare class ModelBase<P extends Props> {
    static readonly EMPTY_PROPS: EmptyProps;
    protected _props: P;
    static isModel(model: any): model is AnyModel;
    static modelMutable<T extends AnyModel>(this: ModelClass<T>): boolean;
    static modelName<T extends AnyModel>(this: ModelClass<T>): ModelName;
    static modelVersion<T extends AnyModel>(this: ModelClass<T>): ModelVersion;
    static modelId<T extends AnyModel>(this: ModelClass<T>): ModelId;
    static ownModelPropsValidator<T extends AnyModel>(this: ModelClass<T>): ModelPropsValidator<T> | undefined;
    static modelPropsValidators<T extends AnyModel>(this: ModelClass<T>): ModelPropsValidator[];
    static ownModelStaticValues<T extends AnyModel>(this: ModelClass<T>): ModelStaticValuesMap<T>;
    static ownModelPropsMap<T extends AnyModel>(this: ModelClass<T>): ModelPropsMap<T>;
    static modelPropsMap<T extends AnyModel>(this: ModelClass<T>): ModelPropsMap<T>;
    constructor();
    redefineModel(): void;
    protected redefineProp<K extends keyof P>(key: keyof this, propTargetKey: K): void;
    modelDescriptor(): ModelDescriptor<typeof this>;
    validateProps(props: P): void;
    validate(): void;
    propsIsEmpty(): boolean;
    props(): P | null;
    metadata(): any;
    protected initializeProps(props: P): void;
}
export type AnyModel = ModelBase<Props>;
export type InferredProps<T extends AnyModel> = T extends ModelBase<infer P> ? P : never;
export interface ModelClass<T extends AnyModel = AnyModel> extends Class<T>, ClassStatic<typeof ModelBase<InferredProps<T>>> {
}
export interface AbstractModelClass<T extends AnyModel = AnyModel> extends AbstractClass<T>, ClassStatic<typeof ModelBase<InferredProps<T>>> {
}
