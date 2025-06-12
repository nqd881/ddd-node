"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.When = void 0;
const meta_1 = require("../../meta");
const When = (eventClass) => {
    return (target, propertyKey, descriptor) => {
        if (typeof descriptor.value === "function") {
            const eventType = eventClass.eventType();
            (0, meta_1.defineEventApplier)(target, eventType, descriptor.value);
        }
    };
};
exports.When = When;
