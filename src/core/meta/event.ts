import "reflect-metadata";

const EVENT_TYPE = Symbol.for("EVENT_TYPE");

export type EventType = string;

export class $EventType extends String {
  static validate(eventType: string) {
    if (eventType.trim().length === 0)
      throw new Error("Event type cannot be an empty string");
  }

  constructor(eventType: EventType) {
    $EventType.validate(eventType);

    super(eventType);
  }
}

export const defineEventType = (target: object, eventType: EventType) => {
  Reflect.defineMetadata(EVENT_TYPE, new $EventType(eventType), target);
};

export const getEventType = (target: object): EventType => {
  const eventType = Reflect.getOwnMetadata<$EventType>(EVENT_TYPE, target);

  if (!eventType) throw new Error("Event's type is not defined");

  return eventType.valueOf();
};
