"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enum = void 0;
const base_1 = require("../base");
const Enum = (value) => {
    return (target, key) => {
        (0, base_1.Static)(() => new target(value !== null && value !== void 0 ? value : key))(target, key);
    };
};
exports.Enum = Enum;
