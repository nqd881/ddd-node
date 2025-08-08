import { AnyEvent, EventClass } from "../core";
import { IEventDispatcher, IEventSubscriberRegistry } from "./interfaces";

export class EventDispatcher implements IEventDispatcher {
  constructor(private subscriberRegistry: IEventSubscriberRegistry) {}

  async dispatch<T extends AnyEvent = AnyEvent>(event: T): Promise<void> {
    const subscribers = this.subscriberRegistry.getAllSubscribersForEvent(
      event.constructor as EventClass
    );

    await Promise.all(
      subscribers.map((subscriber) => subscriber.handleEvent(event))
    );
  }
}
