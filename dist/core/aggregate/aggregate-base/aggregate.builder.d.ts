import { ModelWithIdBuilder } from "../../model-with-id";
import { AnyAggregate } from "./aggregate";
export declare abstract class AggregateBuilderBase<T extends AnyAggregate> extends ModelWithIdBuilder<T> {
    protected version: number;
    withVersion(version: number): this;
}
