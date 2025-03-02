import _ from "lodash";
import { Class } from "type-fest";
import { Mutable, Props, InferredProps } from "../../../base";
import { ClassStatic } from "../../../types";
import { ModelWithId, ModelWithIdMetadata } from "../../model-with-id";

export interface CorrelationIds {
  [type: string]: string | undefined;
}

export interface MessageMetadata extends ModelWithIdMetadata {
  timestamp: number;
  causationId?: string;
  correlationIds: CorrelationIds;
}

@Mutable(false)
export class MessageBase<P extends Props> extends ModelWithId<P> {
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

export type AnyMessage = MessageBase<Props>;

export interface MessageClass<
  T extends AnyMessage = AnyMessage,
  Arguments extends unknown[] = any[]
> extends Class<T, Arguments>,
    ClassStatic<typeof MessageBase<InferredProps<T>>> {}

export interface MessageClassWithTypedConstructor<
  T extends AnyMessage = AnyMessage
> extends MessageClass<
    T,
    ConstructorParameters<typeof MessageBase<InferredProps<T>>>
  > {}
