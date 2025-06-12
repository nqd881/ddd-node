import { AggregateBuilderBase } from "../aggregate-base";
import { AnyStateAggregate, StateAggregateClassWithTypedConstructor } from "./state-aggregate";
export declare class StateAggregateBuilder<T extends AnyStateAggregate> extends AggregateBuilderBase<T> {
    private aggregateClass;
    constructor(aggregateClass: StateAggregateClassWithTypedConstructor<T>);
    build(): T;
}
