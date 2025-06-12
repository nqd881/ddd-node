"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBuilder = exports.MessageBuilderBase = void 0;
const model_with_id_1 = require("../../model-with-id");
class MessageBuilderBase extends model_with_id_1.ModelWithIdBuilder {
    constructor() {
        super(...arguments);
        this.timestamp = Date.now();
        this.correlationIds = {};
    }
    withCausationId(causationId) {
        this.causationId = causationId;
        return this;
    }
    withCorrelationIds(correlationIds) {
        this.correlationIds = correlationIds;
        return this;
    }
    withTimestamp(timestamp) {
        this.timestamp = timestamp;
        return this;
    }
    withTimestampNow() {
        return this.withTimestamp(Date.now());
    }
}
exports.MessageBuilderBase = MessageBuilderBase;
class MessageBuilder extends MessageBuilderBase {
    constructor(messageClass) {
        super();
        this.messageClass = messageClass;
    }
    build() {
        if (!this.props)
            throw new Error("The props must be set before build");
        return new this.messageClass({
            id: this.id,
            timestamp: this.timestamp,
            correlationIds: this.correlationIds,
            causationId: this.causationId,
        }, this.props);
    }
}
exports.MessageBuilder = MessageBuilder;
