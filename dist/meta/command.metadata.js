"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommandType = exports.defineCommandType = exports.$CommandType = void 0;
require("reflect-metadata");
class $CommandType extends String {
    static validate(commandType) {
        if (commandType.trim().length === 0)
            throw new Error("Command type cannot be an empty string");
    }
    constructor(commandType) {
        $CommandType.validate(commandType);
        super(commandType);
    }
}
exports.$CommandType = $CommandType;
const CommandTypeMetaKey = Symbol.for("COMMAND_TYPE");
const defineCommandType = (target, commandType) => {
    Reflect.defineMetadata(CommandTypeMetaKey, new $CommandType(commandType), target);
};
exports.defineCommandType = defineCommandType;
const getCommandType = (target) => {
    const commandType = Reflect.getOwnMetadata(CommandTypeMetaKey, target);
    if (!commandType)
        throw new Error("Command's type is not defined");
    return commandType.valueOf();
};
exports.getCommandType = getCommandType;
