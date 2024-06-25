import { EntityBase, EntityMetadata } from "../entity";

import {
  AnyEvent,
  EventClassWithTypedConstructor,
  EventSource,
} from "../message";
import { Props, PropsOf } from "../../model";

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

  protected newEvent<E extends AnyEvent>(
    eventClass: EventClassWithTypedConstructor<E>,
    props: PropsOf<E>
  ) {
    const eventSource: EventSource = {
      aggregateModel: this.modelName(),
      aggregateId: this.id(),
      aggregateVersion: this.version(),
    };

    return eventClass.newEvent(eventSource, props);
  }
}
