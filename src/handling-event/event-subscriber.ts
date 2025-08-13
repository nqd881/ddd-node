import { AnyEvent, EventClass } from "../core";
import { SubscribedEventsMetaKey } from "./decorators";
import { EventSubscriberHandler, IEventSubscriber } from "./interfaces";

export abstract class EventSubscriber<T extends AnyEvent = AnyEvent>
  implements IEventSubscriber<T>
{
  subscribeToEvents(): EventClass<T, any[]> | EventClass<T, any[]>[] {
    const subscribedEvents =
      Reflect.getOwnMetadata(SubscribedEventsMetaKey, this.constructor) ?? [];

    return subscribedEvents;
  }

  abstract handleEvent(event: T): Promise<void>;
}

export class DynamicEventSubscriber<T extends AnyEvent = AnyEvent>
  implements IEventSubscriber<T>
{
  constructor(
    private readonly subscribedEvents: EventClass<T> | EventClass<T>[],
    private readonly eventHandler: EventSubscriberHandler<T>
  ) {}

  subscribeToEvents() {
    return this.subscribedEvents;
  }

  handleEvent(event: T) {
    return this.eventHandler(event);
  }
}
