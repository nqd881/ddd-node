import { Class } from "#types/class";
import { ClassStatic } from "#types/class-static";
import { Id, Uuid4 } from "./id";
import { Message, MessageContext, MessageMetadata } from "./message";
import { PropsOf } from "./model";
import { ModelTypePattern } from "./model-type";

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
        id: Uuid4.new(),
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
