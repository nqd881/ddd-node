import { AnyEvent, EventClass } from "../core";
import { EventSubscriberHandler, IEventSubscriber } from "./interfaces";
export declare abstract class EventSubscriber<T extends AnyEvent = AnyEvent> implements IEventSubscriber<T> {
    subscribeToEvents(): EventClass<T, any[]> | EventClass<T, any[]>[];
    abstract handleEvent(event: T): Promise<void>;
}
export declare class DynamicEventSubscriber<T extends AnyEvent = AnyEvent> implements IEventSubscriber<T> {
    private readonly subscribedEvents;
    private readonly eventHandler;
    constructor(subscribedEvents: EventClass<T> | EventClass<T>[], eventHandler: EventSubscriberHandler<T>);
    subscribeToEvents(): EventClass<T, any[]> | EventClass<T, any[]>[];
    handleEvent(event: T): Promise<void>;
}
