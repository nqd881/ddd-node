"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBuilder = void 0;
const message_base_1 = require("../message-base");
class EventBuilder extends message_base_1.MessageBuilderBase {
    constructor(eventClass) {
        super();
        this.eventClass = eventClass;
    }
    withSource(source) {
        this.source = source;
        return this;
    }
    build() {
        if (!this.source)
            throw new Error("The event source must be set before build");
        if (!this.props)
            throw new Error("The props must be set before build");
        return new this.eventClass({
            id: this.id,
            timestamp: this.timestamp,
            source: this.source,
            causationId: this.causationId,
            correlationIds: this.correlationIds,
        }, this.props);
    }
}
exports.EventBuilder = EventBuilder;
