import { Class } from "type-fest";
import { getEventType } from "../../../meta";
import { ModelId, Props, PropsOf } from "../../../model";
import { ClassStatic } from "../../../types";
import { Id } from "../../id";
import {
  MessageBase,
  MessageBuilderBase,
  MessageMetadata,
} from "../message-base";

export class EventModelMetadata {
  constructor(private eventClass: EventClass) {}

  get eventType() {
    return getEventType(this.eventClass);
  }
}

export type EventSource = Readonly<{
  aggregateModelId: ModelId;
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

  static eventModelMetadata<T extends AnyEvent>(this: EventClass<T>) {
    return new EventModelMetadata(this);
  }

  eventModelMetadata() {
    return (this.constructor as EventClass).eventModelMetadata();
  }

  source() {
    return this._source;
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
