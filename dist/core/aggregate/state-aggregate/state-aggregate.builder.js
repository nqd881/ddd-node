"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateAggregateBuilder = void 0;
const aggregate_base_1 = require("../aggregate-base");
class StateAggregateBuilder extends aggregate_base_1.AggregateBuilderBase {
    constructor(aggregateClass) {
        super();
        this.aggregateClass = aggregateClass;
    }
    build() {
        if (!this.props)
            throw new Error("The props must be set before build");
        return new this.aggregateClass({
            id: this.id,
            version: this.version,
        }, this.props);
    }
}
exports.StateAggregateBuilder = StateAggregateBuilder;
