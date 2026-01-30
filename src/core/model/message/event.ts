import { Class } from "type-fest";
import { v4 } from "uuid";
import { InferredProps, Props } from "../../../base";
import { ClassStatic } from "../../../types";
import { EventType, getEventType } from "../../meta";
import { Id } from "../identified-model";
import { CausationId, CorrelationIds, Message, MessageClass } from "./message";

export type EventSource = Readonly<{
  aggregateId: Id;
  aggregateVersion: number;
}>;

export interface NewEventOptions {
  id?: Id;
  causationId?: CausationId;
  correlationIds?: CorrelationIds;
}

export class Event<P extends Props> extends Message<P> {
  static new<T extends AnyEvent>(
    this: EventClassWithTypedConstructor<T>,
    eventSource: EventSource,
    props: InferredProps<T>,
    options?: NewEventOptions,
  ) {
    return new this(
      options?.id ?? v4(),
      Date.now(),
      eventSource,
      props,
      options?.causationId,
      options?.correlationIds,
    );
  }

  static eventType<T extends AnyEvent>(this: EventClass<T>) {
    return getEventType(this);
  }

  private readonly _eventType: EventType;
  private _source: EventSource;

  constructor(
    id: Id,
    timestamp: number,
    eventSource: EventSource,
    props: P,
    causationId?: string,
    correlationIds?: CorrelationIds,
  ) {
    super(id, timestamp, props, causationId, correlationIds);

    this._eventType = this._constructor().eventType();
    this._source = eventSource;
  }

  _constructor() {
    return this.constructor as EventClass<typeof this>;
  }

  eventType() {
    return this._eventType;
  }

  source() {
    return this._source;
  }
}

export type AnyEvent = Event<Props>;

export type EventClass<
  T extends AnyEvent = AnyEvent,
  Arguments extends unknown[] = any[],
> = MessageClass<T> &
  Class<T, Arguments> &
  ClassStatic<typeof Event<InferredProps<T>>>;

export type EventClassWithTypedConstructor<T extends AnyEvent = AnyEvent> =
  EventClass<T, ConstructorParameters<typeof Event<InferredProps<T>>>>;
