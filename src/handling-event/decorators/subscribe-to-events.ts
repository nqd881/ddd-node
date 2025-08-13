import { Class } from "type-fest";
import { EventClass } from "../../core";
import { toArray } from "../../utils";
import { IEventSubscriber } from "../interfaces";

export const SubscribedEventsMetaKey = Symbol.for("SUBSCRIBED_EVENTS");

export const SubscribeToEvents = <T extends EventClass>(
  subscribedEvents: T | T[]
) => {
  return (target: Class<IEventSubscriber<InstanceType<T>>>) => {
    Reflect.defineMetadata(
      SubscribedEventsMetaKey,
      toArray(subscribedEvents),
      target
    );
  };
};
