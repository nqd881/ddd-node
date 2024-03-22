import { EventClass, EventType } from "#core";
import { model } from "./model";

export const event =
  (name?: string) =>
  <T extends EventClass>(target: T) => {
    const eventType = new EventType(name ?? target.name);

    model(eventType.value)(target);
  };
