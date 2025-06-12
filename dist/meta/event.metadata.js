"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventType = exports.defineEventType = exports.$EventType = void 0;
require("reflect-metadata");
class $EventType extends String {
    static validate(eventType) {
        if (eventType.trim().length === 0)
            throw new Error("Event type cannot be an empty string");
    }
    constructor(eventType) {
        $EventType.validate(eventType);
        super(eventType);
    }
}
exports.$EventType = $EventType;
const EventTypeMetaKey = Symbol.for("EVENT_TYPE");
const defineEventType = (target, eventType) => {
    Reflect.defineMetadata(EventTypeMetaKey, new $EventType(eventType), target);
};
exports.defineEventType = defineEventType;
const getEventType = (target) => {
    const eventType = Reflect.getOwnMetadata(EventTypeMetaKey, target);
    if (!eventType)
        throw new Error("Event's type is not defined");
    return eventType.valueOf();
};
exports.getEventType = getEventType;
