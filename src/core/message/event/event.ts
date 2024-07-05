import { Class } from "type-fest";
import { EventType, getEventType } from "../../../meta";
import { Props, PropsOf } from "../../../model";
import { ClassStatic } from "../../../types";
import { Id } from "../../id";
import { MessageBase, MessageMetadata } from "../message-base";
import { IEventModelMetadata } from "./event-model.metadata";

export type EventSource = Readonly<{
  aggregateId: Id;
  aggregateVersion: number;
}>;

export interface EventMetadata extends MessageMetadata {
  eventType: EventType;
  source: EventSource;
}

export abstract class EventBase<P extends Props> extends MessageBase<P> {
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

  override modelMetadata(): IEventModelMetadata<typeof this> {
    const eventClass = this.constructor as EventClass<typeof this>;

    return {
      ...super.modelMetadata(),
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
    ClassStatic<typeof EventBase<PropsOf<T>>> {}

export interface EventClassWithTypedConstructor<T extends AnyEvent = AnyEvent>
  extends EventClass<T, ConstructorParameters<typeof EventBase<PropsOf<T>>>> {}
