import { AnyEvent, EventClass } from "../core";
import { IEventPublisher, IEventSubscriberRegistry } from "./interfaces";

export class EventPublisher implements IEventPublisher {
  constructor(private subscriberRegistry: IEventSubscriberRegistry) {}

  async publish<T extends AnyEvent = AnyEvent>(event: T): Promise<void> {
    const subscribers = this.subscriberRegistry.getSubscribersForEvent(
      event.constructor as EventClass
    );

    await Promise.all(
      subscribers.map((subscriber) => subscriber.handleEvent(event))
    );
  }
}
