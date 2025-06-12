"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicEventSubscriber = exports.EventSubscriber = void 0;
const decorators_1 = require("./decorators");
class EventSubscriber {
    subscribeToEvents() {
        var _a;
        const subscribedEvents = (_a = Reflect.getOwnMetadata(decorators_1.SubscribedEventsMetaKey, this.constructor)) !== null && _a !== void 0 ? _a : [];
        return subscribedEvents;
    }
}
exports.EventSubscriber = EventSubscriber;
class DynamicEventSubscriber {
    constructor(subscribedEvents, eventHandler) {
        this.subscribedEvents = subscribedEvents;
        this.eventHandler = eventHandler;
    }
    subscribeToEvents() {
        return this.subscribedEvents;
    }
    handleEvent(event) {
        return this.eventHandler(event);
    }
}
exports.DynamicEventSubscriber = DynamicEventSubscriber;
