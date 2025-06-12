import { Class } from "type-fest";
import { EventClass } from "../../core";
import { IEventSubscriber } from "../interfaces";
export declare const SubscribedEventsMetaKey: unique symbol;
export declare const SubscribeToEvents: <T extends EventClass<import("../../core").AnyEvent, any[]>>(subscribedEvents: T | T[]) => (target: Class<IEventSubscriber<InstanceType<T>>>) => void;
