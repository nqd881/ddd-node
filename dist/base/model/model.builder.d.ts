import { AnyModel, InferredProps } from "./model";
export interface IModelBuilder<T extends AnyModel = AnyModel> {
    buildSafe(): T | null;
    build(): T;
}
export declare abstract class ModelBuilder<T extends AnyModel = AnyModel> implements IModelBuilder<T> {
    protected props?: InferredProps<T>;
    withProps(props: InferredProps<T>): this;
    abstract build(): T;
    buildSafe(): T | null;
}
