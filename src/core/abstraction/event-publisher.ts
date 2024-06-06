import { AnyEvent } from "../message";

export interface IEventPublisher {
  publish(event: AnyEvent): Promise<void>;
  publishAll(events: AnyEvent[]): Promise<void>;
}
