"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandBuilder = void 0;
const message_base_1 = require("../message-base");
class CommandBuilder extends message_base_1.MessageBuilderBase {
    constructor(commandClass) {
        super();
        this.commandClass = commandClass;
    }
    build() {
        if (!this.props)
            throw new Error("The props must be set before build");
        return new this.commandClass({
            id: this.id,
            timestamp: this.timestamp,
            causationId: this.causationId,
            correlationIds: this.correlationIds,
        }, this.props);
    }
}
exports.CommandBuilder = CommandBuilder;
