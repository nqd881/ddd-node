import { Id } from "./id";
import { ModelBase, Props } from "../../base";
export interface ModelWithIdMetadata {
    id: Id;
}
export declare class ModelWithId<P extends Props> extends ModelBase<P> {
    protected readonly _id: Id;
    constructor(metadata: ModelWithIdMetadata);
    metadata(): ModelWithIdMetadata;
    id(): string;
    hasId(id: Id): boolean;
}
export type AnyModelWithId = ModelWithId<Props>;
