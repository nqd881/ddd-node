import { AnyEvent, EventClass } from "../../core";
import { EventType, defineEventType } from "../../meta";

export const Event = (eventType: EventType) => {
  return <T extends AnyEvent>(target: EventClass<T>) => {
    defineEventType(target, eventType);
  };
};
