"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandBase = void 0;
const meta_1 = require("../../../meta");
const message_base_1 = require("../message-base");
const _1 = require(".");
class CommandBase extends message_base_1.MessageBase {
    static builder() {
        return new _1.CommandBuilder(this);
    }
    static commandType() {
        return (0, meta_1.getCommandType)(this);
    }
    constructor(metadata, props) {
        super(metadata, props);
        this._commandType = (0, meta_1.getCommandType)(this.constructor);
    }
    modelDescriptor() {
        const commandClass = this.constructor;
        return Object.assign(Object.assign({}, super.modelDescriptor()), { commandType: commandClass.commandType() });
    }
    metadata() {
        return Object.assign(Object.assign({}, super.metadata()), { commandType: this._commandType });
    }
    commandType() {
        return this._commandType;
    }
}
exports.CommandBase = CommandBase;
