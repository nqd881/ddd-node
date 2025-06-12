import { AnyEvent } from "../../message";

export interface IAggregateEventPublisher {
  publish(events: AnyEvent | AnyEvent[]): void;
}
