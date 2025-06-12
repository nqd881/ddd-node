"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropsInitializedError = void 0;
class PropsInitializedError extends Error {
    constructor() {
        super("Props is initialized");
    }
}
exports.PropsInitializedError = PropsInitializedError;
