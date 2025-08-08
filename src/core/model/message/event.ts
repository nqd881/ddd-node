import { Class } from "type-fest";
import { InferredProps, Props } from "../../../base";
import { ClassStatic } from "../../../types";
import { EventType, getEventType } from "../../meta";
import { Id } from "../model-with-id";
import {
  Message,
  MessageClass,
  MessageMetadata,
  MessageMetadataInput,
} from "./message";

export type EventSource = Readonly<{
  aggregateId: Id;
  aggregateVersion: number;
}>;

export interface EventMetadata extends MessageMetadata {
  eventType: EventType;
  source: EventSource;
}

export type EventMetadataInput = MessageMetadataInput &
  Pick<EventMetadata, "source">;

export class Event<P extends Props> extends Message<P> {
  static build<T extends AnyEvent>(
    this: EventClassWithTypedConstructor<T>,
    props: InferredProps<T>,
    metadata: EventMetadataInput
  ) {
    return new this({ ...this.createMetadata(), ...metadata }, props);
  }

  static eventType<T extends AnyEvent>(this: EventClass<T>) {
    return getEventType(this);
  }

  private readonly _eventType: EventType;
  private readonly _source: EventSource;

  constructor(metadata: Omit<EventMetadata, "eventType">, props: P) {
    super(metadata, props);

    this._eventType = this._constructor().eventType();
    this._source = metadata.source;
  }

  _constructor() {
    return this.constructor as EventClass<typeof this>;
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

export type AnyEvent = Event<Props>;

export type EventClass<
  T extends AnyEvent = AnyEvent,
  Arguments extends unknown[] = any[]
> = MessageClass<T> &
  Class<T, Arguments> &
  ClassStatic<typeof Event<InferredProps<T>>>;

export type EventClassWithTypedConstructor<T extends AnyEvent = AnyEvent> =
  EventClass<T, ConstructorParameters<typeof Event<InferredProps<T>>>>;
