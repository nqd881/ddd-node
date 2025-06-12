"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscribeToEvents = exports.SubscribedEventsMetaKey = void 0;
const utils_1 = require("../../utils");
exports.SubscribedEventsMetaKey = Symbol.for("SUBSCRIBED_EVENTS");
const SubscribeToEvents = (subscribedEvents) => {
    return (target) => {
        Reflect.defineMetadata(exports.SubscribedEventsMetaKey, (0, utils_1.toArray)(subscribedEvents), target);
    };
};
exports.SubscribeToEvents = SubscribeToEvents;
