import { AnyEvent } from "../message";

export interface IEventPublisher {
  publish(event: AnyEvent): void;
  publishAll(events: AnyEvent[]): void;
}
