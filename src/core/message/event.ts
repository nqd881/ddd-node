import { ClassStatic } from "../../types";
import { Class } from "type-fest";
import { Id } from "../id";
import { Props, PropsOf } from "../model";
import { MessageBase, MessageContext, MessageMetadata } from "./message";

export type EventSource = Readonly<{
  aggregate: string;
  id: Id;
  version: number;
}>;

export interface EventMetadata extends Omit<MessageMetadata, "messageType"> {
  source: EventSource;
}

export class EventBase<P extends Props> extends MessageBase<P> {
  static readonly EVENT_MESSAGE_TYPE = "event";

  private readonly _source: EventSource;
  private readonly _eventType: string;

  constructor(metadata: EventMetadata, props: P) {
    super({ ...metadata, messageType: EventBase.EVENT_MESSAGE_TYPE }, props);

    this._source = metadata.source;
    this._eventType = this.modelName();
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

  getSource() {
    return this._source;
  }

  getEventType() {
    return this._eventType;
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
