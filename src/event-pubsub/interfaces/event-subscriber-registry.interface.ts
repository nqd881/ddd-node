import { AnyEvent, EventClass } from "../../core";
import { IEventSubscriber } from "./event-subscriber.interface";

export type Unsubscriber = () => void;

export interface IEventSubscriberRegistry {
  registerSubscriber(subscriber: IEventSubscriber): Unsubscriber;

  deregisterSubscriber(subscriber: IEventSubscriber): void;

  getSubscribersForEvent<T extends AnyEvent = AnyEvent>(
    eventType: EventClass<T>
  ): IEventSubscriber<T>[];

  getSubscribers(): IEventSubscriber[];
}
