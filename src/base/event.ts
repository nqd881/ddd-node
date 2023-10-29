import { getEventType } from "#metadata/event";
import { Class } from "#types/class";
import { ClassStatic } from "#types/class-static";
import { v4 } from "uuid";
import { PropsEnvelope, PropsOf } from "./props-envelope";

export interface IEventAggregate {
  readonly type: string;
  readonly id: string;
  readonly version: number;
}

export interface IEventMetadata {
  readonly id: string;
  readonly timestamp: number;
  readonly aggregate: IEventAggregate;
  correlationId?: string;
  causationId?: string;
}

export type NewEventMetadataOptions = Partial<
  Omit<IEventMetadata, "aggregate" | "timestamp">
>;

export class Event<P extends object>
  extends PropsEnvelope<P>
  implements IEventMetadata
{
  private readonly _id: string;
  private readonly _timestamp: number;
  private readonly _aggregate: IEventAggregate;
  private _correlationId?: string;
  private _causationId?: string;

  constructor(metadata: IEventMetadata, props: P) {
    super(props);

    this._id = metadata.id;
    this._timestamp = metadata.timestamp;
    this._aggregate = metadata.aggregate;
    this._correlationId = metadata?.correlationId;
    this._causationId = metadata?.causationId;
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
        id: v4(),
        timestamp: Date.now(),
        aggregate,
        ...metadata,
      },
      props
    );
  }

  get id() {
    return this._id;
  }

  get timestamp() {
    return this._timestamp;
  }

  get aggregate() {
    return this._aggregate;
  }

  get correlationId() {
    return this._correlationId;
  }

  get causationId() {
    return this._causationId;
  }

  setCorrelationId(correlationId: string) {
    if (!this.correlationId) this._correlationId = correlationId;
  }

  setCausationId(causationId: string) {
    if (!this.causationId) this._causationId = causationId;
  }

  eventType() {
    const prototype = Object.getPrototypeOf(this);

    return getEventType(prototype);
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

export type AnyEventClass = EventClass<AnyEvent>;
