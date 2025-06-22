import { Model, ModelOptions } from "../../base";
import { AnyEvent, EventClass } from "../../core";
import { EventType, defineEventType } from "../../meta";

export const Event = (eventType: EventType, modelOptions?: ModelOptions) => {
  return <T extends AnyEvent>(target: EventClass<T>) => {
    defineEventType(target, eventType);
    Model(modelOptions);
  };
};
