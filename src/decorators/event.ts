import { AnyEvent, EventClass } from "#base/event";
import { EventRegistry, defineEventType } from "#metadata/event";

export const TypeEvent = <T extends AnyEvent>(eventType?: string) => {
  return <U extends EventClass<T>>(target: U) => {
    eventType = eventType ?? target.name;

    defineEventType(target.prototype, eventType ?? target.name);

    EventRegistry.register(eventType, target);
  };
};
