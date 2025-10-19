import { v4 } from "uuid";
import {
  AnyEvent,
  EventClassWithTypedConstructor,
  EventSource,
} from "../message";
import { ModelWithId, ModelWithIdMetadata } from "../model-with-id";
import { InferredProps, Mutable, Props } from "./../../../base";
import { IAggregateEventPublisher } from "./types";

export interface AggregateMetadata extends ModelWithIdMetadata {
  version: number;
}

@Mutable(true)
export abstract class Aggregate<P extends Props> extends ModelWithId<P> {
  static createMetadata(
    metadata?: Partial<AggregateMetadata>
  ): AggregateMetadata {
    return {
      id: v4(),
      version: 0,
      ...metadata,
    };
  }

  protected readonly _version: number;

  constructor(metadata: AggregateMetadata, props?: P) {
    super(metadata);

    if (props) this.initializeProps(props);

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
    props: InferredProps<E>
  ) {
    return eventClass.build(props, { source: this.createEventSource() });
  }

  abstract publishEvents<R = any>(publisher: IAggregateEventPublisher<R>): R;
}

export type AnyAggregate = Aggregate<Props>;
