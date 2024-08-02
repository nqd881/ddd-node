import { AnyEvent, EventClassWithTypedConstructor, EventSource } from "./event";
import { MessageBuilderBase } from "../message-base";

export class EventBuilder<T extends AnyEvent> extends MessageBuilderBase<T> {
  protected source?: EventSource;

  constructor(private eventClass: EventClassWithTypedConstructor<T>) {
    super();
  }

  withSource(source: EventSource) {
    this.source = source;

    return this;
  }

  build(): T {
    if (!this.source)
      throw new Error("The event source must be set before build");

    if (!this.props) throw new Error("The props must be set before build");

    return new this.eventClass(
      {
        id: this.id,
        timestamp: this.timestamp,
        source: this.source,
        causationId: this.causationId,
        correlationIds: this.correlationIds,
      },
      this.props
    );
  }
}
