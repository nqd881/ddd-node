import { getMessageAggregateType } from "#metadata/message";
import { Class } from "#types/class";
import { ClassStatic } from "#types/class-static";
import { Id } from "./id";
import { PropsEnvelope, PropsOf } from "./props-envelope";

export interface IMessageMetadata {
  readonly id: Id;
  readonly timestamp: number;
  readonly aggregateType: string;
  correlationId?: string;
  causationId?: string;
}

export class Message<P extends object>
  extends PropsEnvelope<P>
  implements IMessageMetadata
{
  private readonly _id: Id;
  private readonly _timestamp: number;
  private readonly _aggregateType: string;
  private _correlationId?: string;
  private _causationId?: string;

  constructor(metadata: IMessageMetadata, props: P) {
    super(props);

    this._id = metadata.id;
    this._timestamp = metadata.timestamp;
    this._aggregateType = metadata.aggregateType;
    this._correlationId = metadata?.correlationId;
    this._causationId = metadata?.causationId;
  }

  static aggregateType() {
    return getMessageAggregateType(this.prototype);
  }

  get id() {
    return this._id;
  }

  get timestamp() {
    return this._timestamp;
  }

  get aggregateType() {
    return this._aggregateType;
  }

  get correlationId() {
    return this._correlationId;
  }

  get causationId() {
    return this._causationId;
  }

  setCorrelationId(correlationId: string) {
    if (!this.correlationId) this._correlationId = correlationId;
  }

  setCausationId(causationId: string) {
    if (!this.causationId) this._causationId = causationId;
  }
}

export type AnyMessage = Message<any>;

export type MessageConstructorParamsWithProps<P extends object> =
  ConstructorParameters<typeof Message<P>>;

export type MessageClassWithProps<P extends object> = Class<
  Message<P>,
  MessageConstructorParamsWithProps<P>
> &
  ClassStatic<typeof Message<P>>;

export type MessageConstructorParams<T extends AnyMessage> =
  MessageConstructorParamsWithProps<PropsOf<T>>;

export type MessageClass<T extends AnyMessage> = Class<
  T,
  MessageConstructorParams<T>
> &
  ClassStatic<typeof Message<PropsOf<T>>>;

export type AnyMessageClass = Class<AnyMessage>;
