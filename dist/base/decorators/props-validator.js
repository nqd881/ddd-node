"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropsValidator = void 0;
const __1 = require("..");
const PropsValidator = (target, key, propertyDescriptor) => {
    (0, __1.defineModelPropsValidator)(target, propertyDescriptor.value);
};
exports.PropsValidator = PropsValidator;
