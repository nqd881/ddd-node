import { AnyEvent, EventClass } from "../../core";
import { IEventSubscriber, IGlobalEventSubscriber } from "./event-subscriber.interface";
export type Unsubscriber = () => void;
export interface IEventSubscriberRegistry {
    registerGlobalSubscriber(subscriber: IGlobalEventSubscriber): Unsubscriber;
    deregisterGlobalSubscriber(subscriber: IGlobalEventSubscriber): void;
    registerSubscriber(subscriber: IEventSubscriber): Unsubscriber;
    deregisterSubscriber(subscriber: IEventSubscriber): void;
    getGlobalSubscribers(): IGlobalEventSubscriber[];
    getSubscribers(): IEventSubscriber[];
    getSubscribersForEvent<T extends AnyEvent = AnyEvent>(eventType: EventClass<T>): IEventSubscriber<T>[];
    getAllSubscribersForEvent<T extends AnyEvent = AnyEvent>(eventType: EventClass<T>): (IGlobalEventSubscriber | IEventSubscriber<T>)[];
}
