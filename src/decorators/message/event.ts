import { AnyEvent, EventClass } from "../../core";
import { setEventType } from "../../meta";

export const Event = (eventType: string) => {
  return <T extends AnyEvent>(target: EventClass<T>) => {
    setEventType(target, eventType);
  };
};
