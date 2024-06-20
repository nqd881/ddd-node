import { AnyEvent, EventClass } from "../../core";
import { EventType, setEventType } from "../../meta";

export const Event = (eventType: EventType) => {
  return <T extends AnyEvent>(target: EventClass<T>) => {
    setEventType(target, eventType);
  };
};
