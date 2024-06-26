import { AnyEvent, EventClassWithTypedConstructor, EventSource } from "./event";
import { MessageBuilderBase } from "../message-base";

export class EventBuilder<T extends AnyEvent> extends MessageBuilderBase<T> {
  protected _source?: EventSource;

  constructor(private eventClass: EventClassWithTypedConstructor<T>) {
    super();
  }

  withSource(source: EventSource) {
    this._source = source;

    return this;
  }

  build(): T {
    if (!this._source)
      throw new Error("The event source must be set before build");

    if (!this._props) throw new Error("The props must be set before build");

    return new this.eventClass(
      {
        id: this.getId(),
        timestamp: this.getTimestamp(),
        source: this._source,
        context: this._context,
      },
      this._props
    );
  }
}
