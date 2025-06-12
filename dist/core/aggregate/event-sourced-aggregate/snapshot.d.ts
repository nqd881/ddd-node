import { InferredProps } from "../../../base";
import { AnyEventSourcedAggregate, EventSourceAggregateMetadata } from "./event-sourced-aggregate";
export interface SnapshotMetadata extends EventSourceAggregateMetadata {
}
export interface Snapshot<T extends AnyEventSourcedAggregate> {
    metadata: SnapshotMetadata;
    props: InferredProps<T>;
}
