"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Static = void 0;
const meta_1 = require("../meta");
const Static = (builder) => {
    return (target, key) => {
        (0, meta_1.setModelStaticValue)(target, key, builder);
        (0, meta_1.defineModelStaticValueProperty)(target, key);
    };
};
exports.Static = Static;
