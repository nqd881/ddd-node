import { Class } from "type-fest";
import { v4 } from "uuid";
import { DomainModelClass, InferredProps, Mutable, Props } from "../../../base";
import { ClassStatic } from "../../../types";
import { ModelWithId, ModelWithIdMetadata } from "../model-with-id";

export interface CorrelationIds {
  [type: string]: string | undefined;
}

export interface MessageMetadata extends ModelWithIdMetadata {
  timestamp: number;
  causationId?: string;
  correlationIds: CorrelationIds;
}

export type MessageMetadataInput = Partial<MessageMetadata>;

@Mutable(false)
export class Message<P extends Props> extends ModelWithId<P> {
  static createMetadata = (metadata?: MessageMetadataInput) => {
    return {
      id: v4(),
      timestamp: Date.now(),
      correlationIds: {},
      ...metadata,
    };
  };

  static buildMessage<T extends AnyMessage>(
    this: MessageClassWithTypedConstructor<T>,
    props: InferredProps<T>,
    metadata?: MessageMetadataInput
  ) {
    return new this(this.createMetadata(metadata), props);
  }

  private readonly _timestamp: number;
  private _causationId?: string;
  private _correlationIds: CorrelationIds;

  constructor(metadata: MessageMetadata, props: P) {
    super(metadata);

    this._timestamp = metadata.timestamp;
    this._causationId = metadata.causationId;
    this._correlationIds = metadata.correlationIds;

    this.initializeProps(props);
  }

  override props() {
    return super.props()!;
  }

  override metadata(): MessageMetadata {
    return {
      ...super.metadata(),
      timestamp: this._timestamp,
      correlationIds: this._correlationIds,
      causationId: this._causationId,
    };
  }

  timestamp() {
    return this._timestamp;
  }

  correlationIds() {
    return this._correlationIds;
  }

  causationId() {
    return this._causationId;
  }

  setCausationId(causationId: string) {
    if (!this._causationId) this._causationId = causationId;
  }

  addCorrelationId(type: string, correlationId: string) {
    this._correlationIds[type] = correlationId;
  }

  setCorrelationIds(correlationIds: CorrelationIds) {
    this._correlationIds = correlationIds;
  }
}

export type AnyMessage = Message<Props>;

export type MessageClass<
  T extends AnyMessage = AnyMessage,
  Arguments extends unknown[] = any[]
> = DomainModelClass<T> &
  Class<T, Arguments> &
  ClassStatic<typeof Message<InferredProps<T>>>;

export type MessageClassWithTypedConstructor<
  T extends AnyMessage = AnyMessage
> = MessageClass<T, ConstructorParameters<typeof Message<InferredProps<T>>>>;
