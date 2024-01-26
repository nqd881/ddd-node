import { getEventType } from "#metadata/event";
import { Class } from "#types/class";
import { ClassStatic } from "#types/class-static";
import { Id } from "./id";
import { IMessageMetadata, Message } from "./message";
import { PropsOf } from "./props-envelope";

export interface IEventAggregate {
  readonly id: Id;
  readonly version: number;
}
export interface IEventMetadata extends IMessageMetadata {
  readonly eventType: string;
  readonly aggregate: IEventAggregate;
}

export type NewEventMetadataOptions = Omit<
  IEventMetadata,
  "aggregateType" | "aggregate" | "timestamp"
>;

export class Event<P extends object>
  extends Message<P>
  implements IEventMetadata
{
  private readonly _eventType: string;
  private readonly _aggregate: IEventAggregate;

  constructor(metadata: IEventMetadata, props: P) {
    super(metadata, props);

    this._eventType = metadata.eventType;
    this._aggregate = metadata.aggregate;
  }

  static eventType() {
    return getEventType(this.prototype);
  }

  static newEvent<T extends AnyEvent>(
    this: EventClass<T>,
    aggregate: IEventAggregate,
    props: PropsOf<T>,
    metadata?: NewEventMetadataOptions
  ) {
    return new this(
      {
        eventType: this.eventType(),
        id: Id.unique(),
        timestamp: Date.now(),
        aggregateType: this.aggregateType(),
        aggregate,
        ...metadata,
      },
      props
    );
  }

  get eventType() {
    return this._eventType;
  }

  get aggregate() {
    return this._aggregate;
  }
}

export type AnyEvent = Event<any>;

export type EventConstructorParamsWithProps<P extends object> =
  ConstructorParameters<typeof Event<P>>;

export type EventClassWithProps<P extends object> = Class<
  Event<P>,
  EventConstructorParamsWithProps<P>
> &
  ClassStatic<typeof Event<P>>;

export type EventConstructorParams<T extends AnyEvent> =
  EventConstructorParamsWithProps<PropsOf<T>>;

export type EventClass<T extends AnyEvent> = Class<
  T,
  EventConstructorParams<T>
> &
  ClassStatic<typeof Event<PropsOf<T>>>;

export type AnyEventClass = Class<AnyEvent>;
