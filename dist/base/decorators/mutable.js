"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutable = void 0;
const meta_1 = require("../meta");
const Mutable = (mutable = true) => {
    return (target) => {
        (0, meta_1.defineModelMutable)(target, mutable);
    };
};
exports.Mutable = Mutable;
