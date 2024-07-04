import { PropsOf } from "../../../model";
import {
  AnyEventSourcedAggregate,
  EventSourceAggregateMetadata,
} from "./event-sourced-aggregate";

export interface SnapshotMetadata extends EventSourceAggregateMetadata {}

export interface Snapshot<T extends AnyEventSourcedAggregate> {
  metadata: SnapshotMetadata;
  props: PropsOf<T>;
}
