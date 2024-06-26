import { EntityBase, EntityMetadata } from "../../entity";

import { Props, PropsOf } from "../../../model";
import {
  AnyEvent,
  EventBuilder,
  EventClassWithTypedConstructor,
  EventSource,
} from "../../message";
import { IEventDispatcher } from "../event-dispatcher.interface";

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

  protected createEventSource(): EventSource {
    return {
      aggregateModelId: this.modelMetadata().modelId,
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

  abstract dispatchEvents(dispatcher: IEventDispatcher): void;
}

export type AnyAggregate = AggregateBase<Props>;
