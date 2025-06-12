"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBase = void 0;
const meta_1 = require("../../../meta");
const message_base_1 = require("../message-base");
const _1 = require(".");
class EventBase extends message_base_1.MessageBase {
    static builder() {
        return new _1.EventBuilder(this);
    }
    constructor(metadata, props) {
        super(metadata, props);
        this._eventType = (0, meta_1.getEventType)(this.constructor);
        this._source = metadata.source;
    }
    static eventType() {
        return (0, meta_1.getEventType)(this);
    }
    modelDescriptor() {
        const eventClass = this.constructor;
        return Object.assign(Object.assign({}, super.modelDescriptor()), { eventType: eventClass.eventType() });
    }
    metadata() {
        return Object.assign(Object.assign({}, super.metadata()), { eventType: this._eventType, source: this._source });
    }
    eventType() {
        return this._eventType;
    }
    source() {
        return this._source;
    }
}
exports.EventBase = EventBase;
