import "reflect-metadata";
import { EventType } from "../core";

const EventTypeMetaKey = Symbol.for("EVENT_TYPE");

export const setEventType = (target: object, eventType: EventType) => {
  Reflect.defineMetadata(EventTypeMetaKey, eventType, target);
};

export const getEventType = (target: object): EventType | undefined => {
  return Reflect.getOwnMetadata(EventTypeMetaKey, target);
};
