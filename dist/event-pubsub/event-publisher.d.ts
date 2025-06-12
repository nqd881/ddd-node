import { AnyEvent } from "../core";
import { IEventPublisher, IEventSubscriberRegistry } from "./interfaces";
export declare class EventPublisher implements IEventPublisher {
    private subscriberRegistry;
    constructor(subscriberRegistry: IEventSubscriberRegistry);
    publish<T extends AnyEvent = AnyEvent>(event: T): Promise<void>;
}
