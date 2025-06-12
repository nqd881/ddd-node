"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumBuilder = void 0;
const base_1 = require("../../base");
class EnumBuilder extends base_1.ModelBuilder {
    constructor(enumClass) {
        super();
        this.enumClass = enumClass;
    }
    withValue(value) {
        this._value = value;
        return this;
    }
    build() {
        if (!this._value)
            throw new Error("Cannot parse enum without value");
        const { enumClass } = this;
        let result;
        enumClass.ownModelStaticValues().forEach((staticValue) => {
            if (staticValue.value instanceof enumClass) {
                const staticEnum = staticValue.value;
                if (staticEnum.value === this._value && !result) {
                    result = staticEnum;
                }
            }
        });
        if (!result)
            throw new Error(`Invalid provided value for enum ${enumClass.modelName()}`);
        return result;
    }
}
exports.EnumBuilder = EnumBuilder;
