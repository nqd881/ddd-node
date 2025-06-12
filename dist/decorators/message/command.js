"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const meta_1 = require("../../meta");
const Command = (commandType) => {
    return (target) => {
        (0, meta_1.defineCommandType)(target, commandType);
    };
};
exports.Command = Command;
