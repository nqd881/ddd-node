import _ from "lodash";
import { Id } from "../id";
import { ModelWithId, Props } from "../model";

export interface MessageContext {
  correlationId?: string;
  causationId?: string;
}

export interface MessageMetadata {
  readonly id: Id;
  readonly messageType: string;
  readonly timestamp?: number;
  context?: MessageContext;
}

export class MessageBase<P extends Props> extends ModelWithId<P> {
  private readonly _messageType: string;
  private readonly _timestamp: number;
  private _context?: MessageContext;

  protected constructor(metadata: MessageMetadata, props: P) {
    super(metadata.id);

    this._messageType = metadata.messageType;
    this._context = metadata?.context ?? {};
    this._timestamp = metadata.timestamp ?? Date.now();

    this.initializeProps(props);
  }

  override props(): P {
    return super.props()!;
  }

  getMessageType() {
    return this._messageType;
  }

  getTimestamp() {
    return this._timestamp;
  }

  getContext() {
    return this._context;
  }

  setContext(context: Partial<MessageContext>) {
    this._context = _.merge(this._context, context);
  }
}
