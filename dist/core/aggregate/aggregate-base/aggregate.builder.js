"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregateBuilderBase = void 0;
const model_with_id_1 = require("../../model-with-id");
class AggregateBuilderBase extends model_with_id_1.ModelWithIdBuilder {
    constructor() {
        super(...arguments);
        this.version = 0;
    }
    withVersion(version) {
        this.version = version;
        return this;
    }
}
exports.AggregateBuilderBase = AggregateBuilderBase;
