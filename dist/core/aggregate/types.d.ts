import { AnyEventSourcedAggregate, EventSourcedAggregateClass } from "./event-sourced-aggregate/event-sourced-aggregate";
import { AnyStateAggregate, StateAggregateClass } from "./state-aggregate";
export type Aggregate = AnyStateAggregate | AnyEventSourcedAggregate;
export type AggregateClass = StateAggregateClass | EventSourcedAggregateClass;
