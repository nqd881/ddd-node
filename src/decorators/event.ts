import { EventClass } from "#core/event";
import { EventType } from "#core/model-type";
import { model } from "./model";

export const event =
  (name?: string) =>
  <T extends EventClass>(target: T) => {
    const eventType = new EventType(name ?? target.name);

    model(eventType.value)(target);
  };
