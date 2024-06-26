import { AnyEvent } from "../../message";
import { AggregateBuilderBase } from "../aggregate-base";
import {
  AnyEventSourcedAggregate,
  EventSourcedAggregateClassWithTypedConstructor,
  Snapshot,
} from "./event-sourced-aggregate";

export class EventSourcedAggregateBuilder<
  T extends AnyEventSourcedAggregate
> extends AggregateBuilderBase<T> {
  private _pastEvents?: AnyEvent[];
  private _snapshot?: Snapshot<T>;

  constructor(
    private aggregateClass: EventSourcedAggregateClassWithTypedConstructor<T>
  ) {
    super();
  }

  withPastEvents(pastEvents: AnyEvent[]) {
    this._pastEvents = pastEvents;

    return this;
  }

  withSnapshot(snapshot: Snapshot<T>) {
    this._snapshot = snapshot;

    return this;
  }

  build(): T {
    if (this._snapshot) {
      const { id, version } = this._snapshot.metadata;
      const { props } = this._snapshot;

      this.withId(id).withVersion(version).withProps(props);
    }

    const instance = new this.aggregateClass(
      {
        id: this.getId(),
        version: this.getVersion(),
      },
      this._props
    );

    if (this._pastEvents) {
      const pastEvents = this._pastEvents.filter(
        (_pastEvent) =>
          _pastEvent.source().aggregateVersion >= instance.version()
      );

      instance.applyPastEvents(pastEvents);
    }

    return instance;
  }
}
