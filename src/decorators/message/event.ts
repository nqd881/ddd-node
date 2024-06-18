import { AnyEvent, EventClass, EventType } from "../../core";
import { setEventType } from "../../meta";

export const Event = (eventType: EventType) => {
  return <T extends AnyEvent>(target: EventClass<T>) => {
    setEventType(target, eventType);
  };
};
