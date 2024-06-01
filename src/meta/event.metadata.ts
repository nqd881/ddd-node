import "reflect-metadata";

const EventTypeMetaKey = Symbol.for("EVENT_TYPE");

export const setEventType = (target: object, eventType: string) => {
  Reflect.defineMetadata(EventTypeMetaKey, eventType, target);
};

export const getEventType = (target: object): string | undefined => {
  return Reflect.getOwnMetadata(EventTypeMetaKey, target);
};
