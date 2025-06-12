"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toArray = void 0;
const toArray = (value) => {
    return Array.isArray(value) ? value : [value];
};
exports.toArray = toArray;
