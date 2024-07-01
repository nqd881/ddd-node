import { toArray } from "../../utils";
import { AnyEvent, EventClass } from "../message";
import { IEventSubscriber } from "./event-subscriber";

export type Unsubscriber = () => void;

export interface IEventSubscriberRegistry {
  registerSubscriber(subscriber: IEventSubscriber): Unsubscriber;

  deregisterSubscriber(subscriber: IEventSubscriber): void;

  getSubscribersForEvent<T extends AnyEvent = AnyEvent>(
    eventType: EventClass<T>
  ): IEventSubscriber<T>[];

  getSubscribers(): IEventSubscriber[];
}

export class EventSubscriberRegistry implements IEventSubscriberRegistry {
  private static _instance: EventSubscriberRegistry;

  static instance() {
    if (!this._instance) this._instance = new EventSubscriberRegistry();

    return this._instance;
  }

  private _subscribers: Map<EventClass, IEventSubscriber[]> = new Map();

  constructor(subscribers: IEventSubscriber[] = []) {
    subscribers.forEach((subscriber) => {
      this.registerSubscriber(subscriber);
    });
  }

  private _setSubscribersForEvent<T extends AnyEvent = AnyEvent>(
    eventType: EventClass<T>,
    subscribers: IEventSubscriber<T>[]
  ) {
    this._subscribers.set(eventType, subscribers);
  }

  private _initSubscribersForEvent<T extends AnyEvent = AnyEvent>(
    eventType: EventClass<T>
  ) {
    this._setSubscribersForEvent(eventType, []);
  }

  private _getSubscribersForEvent<T extends AnyEvent = AnyEvent>(
    eventType: EventClass<T>
  ) {
    const subscribers = () =>
      this._subscribers.get(eventType) as IEventSubscriber<T>[] | undefined;

    if (!subscribers()) this._initSubscribersForEvent(eventType);

    return subscribers()!;
  }

  private _hasSubscriber<T extends AnyEvent>(
    subscribedEvent: EventClass<T>,
    subscriber: IEventSubscriber<T>
  ) {
    const subscribers = this._getSubscribersForEvent(subscribedEvent);

    return subscribers.some((_subscriber) => _subscriber === subscriber);
  }

  private _addSubscriber<T extends AnyEvent = AnyEvent>(
    subscribedEvent: EventClass<T>,
    subscriber: IEventSubscriber<T>
  ) {
    if (!this._hasSubscriber(subscribedEvent, subscriber)) {
      const subscribers = this._getSubscribersForEvent(subscribedEvent);

      subscribers.push(subscriber);
    }
  }

  private _removeSubscriber<T extends AnyEvent = AnyEvent>(
    subscribedEvent: EventClass<T>,
    subscriber: IEventSubscriber<T>
  ) {
    const subscribers = this._getSubscribersForEvent(subscribedEvent);

    this._setSubscribersForEvent(
      subscribedEvent,
      subscribers.filter((_subscriber) => _subscriber !== subscriber)
    );
  }

  registerSubscriber(subscriber: IEventSubscriber) {
    const subscribedEvents = toArray(subscriber.subscribeToEvents());

    subscribedEvents.forEach((subscribedEvent) => {
      this._addSubscriber(subscribedEvent, subscriber);
    });

    return () => this.deregisterSubscriber(subscriber);
  }

  deregisterSubscriber(subscriber: IEventSubscriber<AnyEvent>): void {
    const subscribedEvents = toArray(subscriber.subscribeToEvents());

    subscribedEvents.forEach((subscribedEvent) => {
      this._removeSubscriber(subscribedEvent, subscriber);
    });
  }

  getSubscribersForEvent<T extends AnyEvent = AnyEvent>(
    eventType: EventClass<T, any[]>
  ) {
    return Array.from(this._getSubscribersForEvent(eventType));
  }

  getSubscribers(): IEventSubscriber[] {
    return Array.from(this._subscribers.values()).flat();
  }
}
