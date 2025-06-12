"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSourcedAggregateBuilder = void 0;
const aggregate_base_1 = require("../aggregate-base");
class EventSourcedAggregateBuilder extends aggregate_base_1.AggregateBuilderBase {
    constructor(aggregateClass) {
        super();
        this.aggregateClass = aggregateClass;
    }
    withPastEvents(pastEvents) {
        this.pastEvents = pastEvents;
        return this;
    }
    withSnapshot(snapshot) {
        this.snapshot = snapshot;
        return this;
    }
    build() {
        if (this.snapshot) {
            const { id, version } = this.snapshot.metadata;
            const { props } = this.snapshot;
            this.withId(id).withVersion(version).withProps(props);
        }
        const instance = new this.aggregateClass({
            id: this.id,
            version: this.version,
        }, this.props);
        if (this.pastEvents)
            instance.applyPastEvents(this.pastEvents);
        return instance;
    }
}
exports.EventSourcedAggregateBuilder = EventSourcedAggregateBuilder;
