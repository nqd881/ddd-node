import { Props, PropsOf } from "../../../base";
import { EntityBase, EntityMetadata } from "../../entity";
import {
  AnyEvent,
  EventBuilder,
  EventClassWithTypedConstructor,
  EventSource,
} from "../../message";
import { IAggregateEventDispatcher } from "./aggregate-event-dispatcher.interface";

export interface AggregateMetadata extends EntityMetadata {
  version: number;
}

export abstract class AggregateBase<P extends Props> extends EntityBase<P> {
  protected readonly _version: number;

  constructor(metadata: AggregateMetadata, props?: P) {
    super(metadata, props);

    this._version = metadata.version;
  }

  abstract version(): number;

  override metadata(): AggregateMetadata {
    return {
      ...super.metadata(),
      version: this.version(),
    };
  }

  protected createEventSource(): EventSource {
    return {
      aggregateId: this.id(),
      aggregateVersion: this.version(),
    };
  }

  protected newEvent<E extends AnyEvent>(
    eventClass: EventClassWithTypedConstructor<E>,
    props: PropsOf<E>
  ) {
    const eventBuilder = new EventBuilder(eventClass);

    return eventBuilder
      .withSource(this.createEventSource())
      .withProps(props)
      .build();
  }

  abstract dispatchEvents(dispatcher: IAggregateEventDispatcher): void;
}

export type AnyAggregate = AggregateBase<Props>;
