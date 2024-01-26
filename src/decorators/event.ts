import { AnyEvent, EventClass } from "#base/event";
import { EventRegistry, defineEventType } from "#metadata/event";
import { TypeMessage } from "./message";

export const TypeEvent = <T extends AnyEvent>(
  aggregateType: string,
  eventType?: string
) => {
  return <U extends EventClass<T>>(target: U) => {
    TypeMessage(aggregateType)(target);

    eventType = eventType ?? target.name;

    defineEventType(target.prototype, eventType ?? target.name);

    EventRegistry.register(eventType, target);
  };
};
