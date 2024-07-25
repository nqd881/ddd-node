import { AnyEvent, EventClass } from "../../core";

export interface IEventSubscriber<T extends AnyEvent = AnyEvent> {
  subscribeToEvents(): EventClass<T> | EventClass<T>[];
  handleEvent(event: T): Promise<void>;
}

export type EventSubscriberHandler<T extends AnyEvent = AnyEvent> =
  IEventSubscriber<T>["handleEvent"];
