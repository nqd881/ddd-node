import _ from "lodash";
import { Class } from "type-fest";
import { Mutable, Props, PropsOf } from "../../../model";
import { ClassStatic } from "../../../types";
import { Id } from "../../id";
import { ModelWithId } from "../../model-with-id";

export interface MessageContext {
  correlationId?: string;
  causationId?: string;
}

export interface MessageMetadata {
  readonly id: Id;
  readonly messageType: string;
  readonly timestamp: number;
  context?: MessageContext;
}

@Mutable(false)
export class MessageBase<P extends Props> extends ModelWithId<P> {
  private readonly _messageType: string;
  private readonly _timestamp: number;
  private _context?: MessageContext;

  constructor(metadata: MessageMetadata, props: P) {
    super(metadata.id);

    this._messageType = metadata.messageType;
    this._context = metadata?.context ?? {};
    this._timestamp = metadata.timestamp;

    this.initializeProps(props);
  }

  override props() {
    return super.props()!;
  }

  messageType() {
    return this._messageType;
  }

  timestamp() {
    return this._timestamp;
  }

  context() {
    return this._context;
  }

  setContext(context: Partial<MessageContext>) {
    this._context = _.merge(this._context, context);
  }
}

export type AnyMessage = MessageBase<Props>;

export interface MessageClass<
  T extends AnyMessage = AnyMessage,
  Arguments extends unknown[] = any[]
> extends Class<T, Arguments>,
    ClassStatic<typeof MessageBase<PropsOf<T>>> {}

export interface MessageClassWithTypedConstructor<
  T extends AnyMessage = AnyMessage
> extends MessageClass<
    T,
    ConstructorParameters<typeof MessageBase<PropsOf<T>>>
  > {}
