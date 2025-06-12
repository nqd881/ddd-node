import { AnyEvent, EventClass } from "../core";
import { IEventSubscriber, IEventSubscriberRegistry, IGlobalEventSubscriber, Unsubscriber } from "./interfaces";
export declare class EventSubscriberRegistry implements IEventSubscriberRegistry {
    private static _instance;
    static instance(): EventSubscriberRegistry;
    private _globalSubscribers;
    private _subscribers;
    constructor(subscribers?: IEventSubscriber[]);
    private _setSubscribersForEvent;
    private _initSubscribersForEvent;
    private _getSubscribersForEvent;
    private _hasSubscriber;
    private _addSubscriber;
    private _removeSubscriber;
    registerGlobalSubscriber(subscriber: IGlobalEventSubscriber): Unsubscriber;
    deregisterGlobalSubscriber(subscriber: IGlobalEventSubscriber): void;
    registerSubscriber(subscriber: IEventSubscriber): Unsubscriber;
    deregisterSubscriber(subscriber: IEventSubscriber<AnyEvent>): void;
    getGlobalSubscribers(): IGlobalEventSubscriber[];
    getSubscribers(): IEventSubscriber[];
    getSubscribersForEvent<T extends AnyEvent = AnyEvent>(eventType: EventClass<T>): IEventSubscriber<T>[];
    getAllSubscribersForEvent<T extends AnyEvent = AnyEvent>(eventType: EventClass<T>): (IGlobalEventSubscriber | IEventSubscriber<T>)[];
}
