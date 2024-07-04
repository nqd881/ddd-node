import { AnyEvent } from "../../message";
import { AggregateBuilderBase } from "../aggregate-base";
import {
  AnyEventSourcedAggregate,
  EventSourcedAggregateClassWithTypedConstructor,
} from "./event-sourced-aggregate";
import { Snapshot } from "./snapshot";

export class EventSourcedAggregateBuilder<
  T extends AnyEventSourcedAggregate
> extends AggregateBuilderBase<T> {
  private pastEvents?: AnyEvent[];
  private snapshot?: Snapshot<T>;

  constructor(
    private aggregateClass: EventSourcedAggregateClassWithTypedConstructor<T>
  ) {
    super();
  }

  withPastEvents(pastEvents: AnyEvent[]) {
    this.pastEvents = pastEvents;

    return this;
  }

  withSnapshot(snapshot: Snapshot<T>) {
    this.snapshot = snapshot;

    return this;
  }

  build(): T {
    if (this.snapshot) {
      const { id, version } = this.snapshot.metadata;
      const { props } = this.snapshot;

      this.withId(id).withVersion(version).withProps(props);
    }

    const instance = new this.aggregateClass(
      {
        id: this.id,
        version: this.version,
      },
      this.props
    );

    if (this.pastEvents) instance.applyPastEvents(this.pastEvents);

    return instance;
  }
}
