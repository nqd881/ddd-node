import { Id, IdentifiedModel } from "../identified-model";
import {
  AnyEvent,
  EventClassWithTypedConstructor,
  EventSource,
  NewEventOptions,
} from "../message";
import { InferredProps, Mutable, Props } from "./../../../base";

@Mutable(true)
export abstract class Aggregate<P extends Props> extends IdentifiedModel<P> {
  protected readonly _version: number;

  constructor(id: Id, version: number, props?: P) {
    super(id);

    this._version = version;

    if (props) this.initializeProps(props);
  }

  abstract get version(): number;

  protected asEventSource(): EventSource {
    return {
      aggregateId: this.id,
      aggregateVersion: this.version,
    };
  }

  protected newEvent<E extends AnyEvent>(
    eventClass: EventClassWithTypedConstructor<E>,
    props: InferredProps<E>,
    options?: NewEventOptions
  ) {
    return eventClass.new(this.asEventSource(), props, options);
  }

  abstract releaseEvents(): AnyEvent[];
}

export type AnyAggregate = Aggregate<Props>;
