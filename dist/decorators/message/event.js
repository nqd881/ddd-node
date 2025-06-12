"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const meta_1 = require("../../meta");
const Event = (eventType) => {
    return (target) => {
        (0, meta_1.defineEventType)(target, eventType);
    };
};
exports.Event = Event;
