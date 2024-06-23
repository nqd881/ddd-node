import { Class } from "type-fest";
import { EventType, getEventType } from "../../meta";
import { ClassStatic } from "../../types";
import { Id } from "../id";
import { Props, PropsOf } from "../model";
import { MessageBase, MessageContext, MessageMetadata } from "./message";

export type EventSource = Readonly<{
  aggregateModel: string;
  aggregateId: Id;
  aggregateVersion: number;
}>;

export interface EventMetadata extends Omit<MessageMetadata, "messageType"> {
  source: EventSource;
}

export class EventBase<P extends Props> extends MessageBase<P> {
  static readonly EVENT_MESSAGE_TYPE = "event";

  private readonly _source: EventSource;

  constructor(metadata: EventMetadata, props: P) {
    super({ ...metadata, messageType: EventBase.EVENT_MESSAGE_TYPE }, props);

    this._source = metadata.source;
  }

  static eventType(): EventType {
    return getEventType(this);
  }

  static newEvent<T extends AnyEvent>(
    this: EventClassWithTypedConstructor<T>,
    source: EventSource,
    props: PropsOf<T>,
    context?: MessageContext,
    timestamp?: number
  ) {
    return new this(
      {
        id: this.id(),
        source,
        context,
        timestamp,
      },
      props
    );
  }

  source() {
    return this._source;
  }

  eventType() {
    return (this.constructor as EventClass).eventType();
  }
}

export type AnyEvent = EventBase<Props>;

export interface EventClass<
  T extends AnyEvent = AnyEvent,
  Arguments extends unknown[] = any[]
> extends Class<T, Arguments>,
    ClassStatic<typeof EventBase<PropsOf<T>>> {}

export interface EventClassWithTypedConstructor<T extends AnyEvent = AnyEvent>
  extends EventClass<T, ConstructorParameters<typeof EventBase<PropsOf<T>>>> {}
