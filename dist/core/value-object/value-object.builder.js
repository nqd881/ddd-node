"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueObjectBuilder = void 0;
const base_1 = require("../../base");
class ValueObjectBuilder extends base_1.ModelBuilder {
    constructor(valueObjectClass) {
        super();
        this.valueObjectClass = valueObjectClass;
    }
    build() {
        if (!this.props)
            throw new Error("The props must be set before build");
        return new this.valueObjectClass(this.props);
    }
}
exports.ValueObjectBuilder = ValueObjectBuilder;
