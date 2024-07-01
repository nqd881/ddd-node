import { AnyEvent, EventClass } from "../message";

export interface IEventSubscriber<T extends AnyEvent = AnyEvent> {
  subscribeToEvents(): EventClass<T> | EventClass<T>[];
  handleEvent(event: T): Promise<void>;
}

export type EventSubscriberHandler<T extends AnyEvent = AnyEvent> =
  IEventSubscriber<T>["handleEvent"];

export class EventSubscriber<T extends AnyEvent = AnyEvent>
  implements IEventSubscriber<T>
{
  constructor(
    private readonly subscribedEvent: EventClass<T>,
    private readonly eventHandler: EventSubscriberHandler<T>
  ) {}

  subscribeToEvents() {
    return this.subscribedEvent;
  }

  handleEvent(event: T) {
    return this.eventHandler(event);
  }
}
