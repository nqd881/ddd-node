import { AnyEventClass } from "#base/event";
import "reflect-metadata";
import { EVENT_TYPE } from "./constants";
import { Registry } from "./registry";
import { EventTypeHasNotBeenSetError } from "./errors";

export const EventRegistry = new Registry<AnyEventClass>();

export const defineEventType = (target: object, eventType: string) => {
  Reflect.defineMetadata(EVENT_TYPE, eventType, target);
};

export const getEventType = (target: object): string => {
  const eventType = Reflect.getMetadata(EVENT_TYPE, target);

  if (!eventType) throw new EventTypeHasNotBeenSetError();

  return eventType;
};
