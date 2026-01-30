import { ESAggregateClass } from "./es-aggregate";
import { StateAggregateClass } from "./state-aggregate";

export type AggregateClass = StateAggregateClass | ESAggregateClass;
