"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handle = void 0;
const meta_1 = require("../../meta");
const Handle = (commandClass) => {
    return (target, propertyKey, descriptor) => {
        if (typeof descriptor.value === "function") {
            const commandType = commandClass.commandType();
            (0, meta_1.defineCommandHandler)(target, commandType, descriptor.value);
        }
    };
};
exports.Handle = Handle;
