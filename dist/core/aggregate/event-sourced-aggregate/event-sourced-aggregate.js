"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSourcedAggregateBase = void 0;
const meta_1 = require("../../../meta");
const utils_1 = require("../../../utils");
const aggregate_base_1 = require("../aggregate-base");
const _1 = require(".");
class EventSourcedAggregateBase extends aggregate_base_1.AggregateBase {
    static builder() {
        return new _1.EventSourcedAggregateBuilder(this);
    }
    constructor(metadata, props) {
        super(metadata, props);
        this._handledCommands = [];
        this._events = [];
        this._pastEvents = [];
    }
    static ownEventApplierMap() {
        return (0, meta_1.getOwnEventApplierMap)(this.prototype);
    }
    static eventApplierMap() {
        return (0, meta_1.getEventApplierMap)(this.prototype);
    }
    static ownCommandHandlerMap() {
        return (0, meta_1.getOwnCommandHandlerMap)(this.prototype);
    }
    static commandHandlerMap() {
        return (0, meta_1.getCommandHandlerMap)(this.prototype);
    }
    modelDescriptor() {
        const aggregateClass = this.constructor;
        return Object.assign(Object.assign({}, super.modelDescriptor()), { ownEventApplierMap: aggregateClass.ownEventApplierMap(), eventApplierMap: aggregateClass.eventApplierMap(), ownCommandHandlerMap: aggregateClass.ownCommandHandlerMap(), commandHandlerMap: aggregateClass.commandHandlerMap() });
    }
    version() {
        return this._version + this._pastEvents.length + this._events.length;
    }
    pastEvents() {
        return Array.from(this._pastEvents);
    }
    events() {
        return Array.from(this._events);
    }
    handledCommands() {
        return Array.from(this._handledCommands);
    }
    hasNewEvent() {
        return Boolean(this._events.length);
    }
    getEventApplier(event) {
        const { eventType } = event.modelDescriptor();
        const { eventApplierMap } = this.modelDescriptor();
        const applier = eventApplierMap.get(eventType);
        if (!applier)
            throw new Error("Event applier not found");
        return applier;
    }
    validateEventBeforeApply(event) {
        const { aggregateId, aggregateVersion } = event.source();
        if (aggregateId !== this._id)
            throw new Error("Invalid aggregate id");
        if (aggregateVersion !== this.version())
            throw new Error("Invalid aggregate version");
    }
    _applyEvent(event) {
        const applier = this.getEventApplier(event);
        this.validateEventBeforeApply(event);
        applier.call(this, event);
    }
    applyPastEvent(event) {
        if (this.hasNewEvent())
            throw new Error("Cannot apply a past event when new event is recorded");
        this._applyEvent(event);
        this._pastEvents.push(event);
    }
    applyPastEvents(pastEvents) {
        pastEvents.forEach((pastEvent) => {
            this.applyPastEvent(pastEvent);
        });
    }
    applyEvent(event) {
        this._applyEvent(event);
        this._events.push(event);
    }
    applyEvents(events) {
        events.forEach((event) => {
            this.applyEvent(event);
        });
    }
    applyNewEvent(eventClass, props) {
        this.applyEvent(this.newEvent(eventClass, props));
    }
    getCommandHandler(command) {
        const { commandType } = command.modelDescriptor();
        const { commandHandlerMap } = this.modelDescriptor();
        const handler = commandHandlerMap.get(commandType);
        if (!handler)
            throw new Error("Command handler not found");
        return handler;
    }
    handleCommand(command) {
        const handler = this.getCommandHandler(command);
        const events = (0, utils_1.toArray)(handler.call(this, command));
        events.forEach((event) => {
            event.setCausationId(command.id());
            event.setCorrelationIds(command.correlationIds());
        });
        this.applyEvents(events);
        this._handledCommands.push(command);
        return events;
    }
    snapMetadata() {
        return {
            id: this.id(),
            version: this.version(),
        };
    }
    snap() {
        if (this.propsIsEmpty())
            throw new Error("Cannot create snapshot when the props is not initialized");
        return {
            metadata: this.snapMetadata(),
            props: this.props(),
        };
    }
    archiveEvents() {
        const events = this.events();
        this._events = [];
        this._pastEvents.push(...events);
    }
    publishEvents(publisher) {
        publisher.publish(this.events());
        this.archiveEvents();
    }
}
exports.EventSourcedAggregateBase = EventSourcedAggregateBase;
