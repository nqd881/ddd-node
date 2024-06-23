import "reflect-metadata";

export type EventType = string;

export class EType extends String {
  static validate(eventType: string) {
    if (eventType.trim().length === 0)
      throw new Error("Event type cannot be an empty string");
  }

  constructor(eventType: EventType) {
    EType.validate(eventType);

    super(eventType);
  }
}

const EventTypeMetaKey = Symbol.for("EVENT_TYPE");

export const defineEventType = (target: object, eventType: EventType) => {
  Reflect.defineMetadata(EventTypeMetaKey, new EType(eventType), target);
};

export const getEventType = (target: object): EventType => {
  const eventType = Reflect.getOwnMetadata<EType>(EventTypeMetaKey, target);

  if (!eventType) throw new Error("Event's type is not defined");

  return eventType.valueOf();
};
