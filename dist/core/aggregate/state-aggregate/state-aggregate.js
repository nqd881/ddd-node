"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateAggregateBase = void 0;
const aggregate_base_1 = require("../aggregate-base");
const _1 = require(".");
class StateAggregateBase extends aggregate_base_1.AggregateBase {
    static builder() {
        return new _1.StateAggregateBuilder(this);
    }
    constructor(metadata, props) {
        super(metadata, props);
        this._events = [];
    }
    props() {
        return super.props();
    }
    version() {
        return this._version;
    }
    events() {
        return Array.from(this._events);
    }
    recordEvent(param1, param2) {
        let event;
        if (typeof param1 === "function" && param2) {
            event = this.newEvent(param1, param2);
        }
        else {
            event = param1;
        }
        this._events.push(event);
    }
    clearEvents() {
        this._events = [];
    }
    publishEvents(publisher) {
        publisher.publish(this.events());
        this.clearEvents();
    }
}
exports.StateAggregateBase = StateAggregateBase;
