import { ModelBuilder } from "../../base";
import { AnyModelWithId } from "./model-with-id";
import { Id } from "./id";
export declare abstract class ModelWithIdBuilder<T extends AnyModelWithId> extends ModelBuilder<T> {
    protected id: Id;
    newId(): string;
    withId(id: Id): this;
    withNewId(): this;
}
