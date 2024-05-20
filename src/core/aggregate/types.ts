import {
  AnyEventSourcedAggregate,
  EventSourcedAggregateClass,
} from "./event-sourced-aggregate";
import { AnyStateAggregate, StateAggregateClass } from "./state-aggregate";

export type AnyAggregate = AnyStateAggregate | AnyEventSourcedAggregate;

export type AnyAggregateClass =
  | StateAggregateClass
  | EventSourcedAggregateClass;
