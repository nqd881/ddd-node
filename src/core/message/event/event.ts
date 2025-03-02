import { Class } from "type-fest";
import { EventType, getEventType } from "../../../meta";
import { Props, InferredProps } from "../../../base";
import { ClassStatic } from "../../../types";
import { Id } from "../../model-with-id";
import { MessageBase, MessageMetadata } from "../message-base";
import { EventModelDescriptor } from "./event-model-descriptor";
import { EventBuilder } from ".";

export type EventSource = Readonly<{
  aggregateId: Id;
  aggregateVersion: number;
}>;

export interface EventMetadata extends MessageMetadata {
  eventType: EventType;
  source: EventSource;
}

export class EventBase<P extends Props> extends MessageBase<P> {
  static builder<T extends AnyEvent>(this: EventClass<T>): EventBuilder<T> {
    return new EventBuilder(this);
  }

  private readonly _eventType: EventType;
  private readonly _source: EventSource;

  constructor(metadata: Omit<EventMetadata, "eventType">, props: P) {
    super(metadata, props);

    this._eventType = getEventType(this.constructor);
    this._source = metadata.source;
  }

  static eventType(): EventType {
    return getEventType(this);
  }

  override modelDescriptor(): EventModelDescriptor<typeof this> {
    const eventClass = this.constructor as EventClass<typeof this>;

    return {
      ...super.modelDescriptor(),
      eventType: eventClass.eventType(),
    };
  }

  override metadata(): EventMetadata {
    return {
      ...super.metadata(),
      eventType: this._eventType,
      source: this._source,
    };
  }

  eventType() {
    return this._eventType;
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
    ClassStatic<typeof EventBase<InferredProps<T>>> {}

export interface EventClassWithTypedConstructor<T extends AnyEvent = AnyEvent>
  extends EventClass<
    T,
    ConstructorParameters<typeof EventBase<InferredProps<T>>>
  > {}
