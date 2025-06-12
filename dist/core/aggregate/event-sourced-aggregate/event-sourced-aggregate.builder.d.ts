import { AnyEvent } from "../../message";
import { AggregateBuilderBase } from "../aggregate-base";
import { AnyEventSourcedAggregate, EventSourcedAggregateClassWithTypedConstructor } from "./event-sourced-aggregate";
import { Snapshot } from "./snapshot";
export declare class EventSourcedAggregateBuilder<T extends AnyEventSourcedAggregate> extends AggregateBuilderBase<T> {
    private aggregateClass;
    private pastEvents?;
    private snapshot?;
    constructor(aggregateClass: EventSourcedAggregateClassWithTypedConstructor<T>);
    withPastEvents(pastEvents: AnyEvent[]): this;
    withSnapshot(snapshot: Snapshot<T>): this;
    build(): T;
}
