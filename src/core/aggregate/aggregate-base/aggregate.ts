import { Mutable, Props, InferredProps } from "../../../base";
import { ModelWithId, ModelWithIdMetadata } from "../../model-with-id";
import {
  AnyEvent,
  EventClassWithTypedConstructor,
  EventSource,
} from "../../message";
import { IAggregateEventPublisher } from "./aggregate-event-publisher.interface";

export interface AggregateMetadata extends ModelWithIdMetadata {
  version: number;
}

@Mutable(true)
export abstract class AggregateBase<P extends Props> extends ModelWithId<P> {
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
    return eventClass
      .builder()
      .withSource(this.createEventSource())
      .withProps(props)
      .build();
  }

  abstract publishEvents(publisher: IAggregateEventPublisher): void;
}

export type AnyAggregate = AggregateBase<Props>;
