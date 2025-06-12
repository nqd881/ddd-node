"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSubscriberRegistry = void 0;
const utils_1 = require("../utils");
class EventSubscriberRegistry {
    static instance() {
        if (!this._instance)
            this._instance = new EventSubscriberRegistry();
        return this._instance;
    }
    constructor(subscribers = []) {
        this._globalSubscribers = new Set();
        this._subscribers = new Map();
        subscribers.forEach((subscriber) => {
            this.registerSubscriber(subscriber);
        });
    }
    _setSubscribersForEvent(eventType, subscribers) {
        this._subscribers.set(eventType, subscribers);
    }
    _initSubscribersForEvent(eventType) {
        this._setSubscribersForEvent(eventType, []);
    }
    _getSubscribersForEvent(eventType) {
        const subscribers = () => this._subscribers.get(eventType);
        if (!subscribers())
            this._initSubscribersForEvent(eventType);
        return subscribers();
    }
    _hasSubscriber(subscribedEvent, subscriber) {
        const subscribers = this._getSubscribersForEvent(subscribedEvent);
        return subscribers.some((_subscriber) => _subscriber === subscriber);
    }
    _addSubscriber(subscribedEvent, subscriber) {
        if (!this._hasSubscriber(subscribedEvent, subscriber)) {
            const subscribers = this._getSubscribersForEvent(subscribedEvent);
            subscribers.push(subscriber);
        }
    }
    _removeSubscriber(subscribedEvent, subscriber) {
        const subscribers = this._getSubscribersForEvent(subscribedEvent);
        this._setSubscribersForEvent(subscribedEvent, subscribers.filter((_subscriber) => _subscriber !== subscriber));
    }
    registerGlobalSubscriber(subscriber) {
        this._globalSubscribers.add(subscriber);
        return () => this.deregisterGlobalSubscriber(subscriber);
    }
    deregisterGlobalSubscriber(subscriber) {
        this._globalSubscribers.delete(subscriber);
    }
    registerSubscriber(subscriber) {
        const subscribedEvents = (0, utils_1.toArray)(subscriber.subscribeToEvents());
        subscribedEvents.forEach((subscribedEvent) => {
            this._addSubscriber(subscribedEvent, subscriber);
        });
        return () => this.deregisterSubscriber(subscriber);
    }
    deregisterSubscriber(subscriber) {
        const subscribedEvents = (0, utils_1.toArray)(subscriber.subscribeToEvents());
        subscribedEvents.forEach((subscribedEvent) => {
            this._removeSubscriber(subscribedEvent, subscriber);
        });
    }
    getGlobalSubscribers() {
        return Array.from(this._globalSubscribers);
    }
    getSubscribers() {
        return Array.from(this._subscribers.values()).flat();
    }
    getSubscribersForEvent(eventType) {
        return Array.from(this._getSubscribersForEvent(eventType));
    }
    getAllSubscribersForEvent(eventType) {
        return [
            ...this.getGlobalSubscribers(),
            ...this.getSubscribersForEvent(eventType),
        ];
    }
}
exports.EventSubscriberRegistry = EventSubscriberRegistry;
