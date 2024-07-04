import _ from "lodash";
import { Class } from "type-fest";
import { Mutable, Props, PropsOf } from "../../../model";
import { ClassStatic } from "../../../types";
import {
  IdentifiableModel,
  IdentifiableModelMetadata,
} from "../../identifiable-model";

export interface MessageContext {
  correlationId?: string;
  causationId?: string;
}

export interface MessageMetadata extends IdentifiableModelMetadata {
  timestamp: number;
  context?: MessageContext;
}

@Mutable(false)
export class MessageBase<P extends Props> extends IdentifiableModel<P> {
  private readonly _timestamp: number;
  private _context?: MessageContext;

  constructor(metadata: MessageMetadata, props: P) {
    super(metadata);

    this._context = metadata?.context ?? {};
    this._timestamp = metadata.timestamp;

    this.initializeProps(props);
  }

  override props() {
    return super.props()!;
  }

  override metadata(): MessageMetadata {
    return {
      ...super.metadata(),
      timestamp: this._timestamp,
      context: this._context,
    };
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
