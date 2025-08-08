import { ESAggregateClass } from "./es-aggregate";
import { StateAggregateClass } from "./state-aggregate";
import { AnyEvent } from "../message";

export type AggregateClass = StateAggregateClass | ESAggregateClass;

export interface IAggregateEventPublisher {
  publish(events: AnyEvent | AnyEvent[]): void;
}
