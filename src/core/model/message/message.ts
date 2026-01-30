import _ from "lodash";
import { Class } from "type-fest";
import { DomainModelClass, InferredProps, Mutable, Props } from "../../../base";
import { ClassStatic } from "../../../types";
import { Id, IdentifiedModel } from "../identified-model";

export type Timestamp = number;

export type CausationId = string;

export interface CorrelationIds {
  [type: string]: string | undefined;
}

@Mutable(false)
export class Message<P extends Props> extends IdentifiedModel<P> {
  private _timestamp: Timestamp;
  private _causationId?: CausationId;
  private _correlationIds: CorrelationIds;

  constructor(
    id: Id,
    timestamp: Timestamp,
    props: P,
    causationId?: CausationId,
    correlationIds?: CorrelationIds
  ) {
    super(id);

    this._timestamp = timestamp;
    this._causationId = causationId;
    this._correlationIds = correlationIds ?? {};

    this.initializeProps(props);
  }

  override props() {
    return super.props()!;
  }

  get timestamp() {
    return this._timestamp;
  }

  get correlationIds() {
    return this._correlationIds;
  }

  get causationId() {
    return this._causationId;
  }

  setTimestamp(timestamp: number) {
    this._timestamp = timestamp;
  }

  setCausationId(causationId: string) {
    this._causationId = causationId;
  }

  setCorrelationId(type: string, correlationId: string) {
    this._correlationIds[type] = correlationId;
  }

  setCorrelationIds(correlationIds: CorrelationIds) {
    this._correlationIds = correlationIds;
  }

  mergeCorrelationIds(correlationIds: CorrelationIds) {
    this.setCorrelationIds(_.merge(this._correlationIds, correlationIds));
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
