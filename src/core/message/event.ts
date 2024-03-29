import { Class, ClassStatic } from "#types";
import { Id } from "../id";
import { ModelTypePattern, PropsOf } from "../model";
import { Message, MessageContext, MessageMetadata } from "./message";

export type EventSource = Readonly<{
  type: ModelTypePattern;
  id: Id;
  version: number;
}>;

export interface EventMetadata extends MessageMetadata {
  source: EventSource;
}

export class Event<Props extends object> extends Message<Props> {
  private readonly _source: EventSource;

  constructor(metadata: EventMetadata, props: Props) {
    super(metadata, props);

    this._source = metadata.source;
  }

  static newEvent<T extends AnyEvent>(
    this: EventClassWithTypedConstructor<T>,
    source: EventSource,
    props: PropsOf<T>,
    context?: MessageContext
  ) {
    return new this(
      {
        id: this.id(),
        timestamp: Date.now(),
        source,
        context,
      },
      props
    );
  }

  getSource() {
    return this._source;
  }
}

export type AnyEvent = Event<any>;

export type EventClass<
  T extends AnyEvent = AnyEvent,
  Arguments extends unknown[] = any[]
> = Class<T, Arguments> & ClassStatic<typeof Event<PropsOf<T>>>;

export type EventClassWithTypedConstructor<T extends AnyEvent = AnyEvent> =
  EventClass<T, ConstructorParameters<typeof Event<PropsOf<T>>>>;
