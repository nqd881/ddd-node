"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prop = void 0;
const meta_1 = require("../meta");
const Prop = (propTargetKey) => {
    return (target, key) => {
        (0, meta_1.defineModelProp)(target, key, propTargetKey !== null && propTargetKey !== void 0 ? propTargetKey : key);
    };
};
exports.Prop = Prop;
