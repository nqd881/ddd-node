import _ from "lodash";
import { Mutable, Props } from "../../model";
import { Id } from "../id";
import { ModelWithId } from "../model-with-id";

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

@Mutable(false)
export class MessageBase<P extends Props> extends ModelWithId<P> {
  private readonly _messageType: string;
  private readonly _timestamp: number;
  private _context?: MessageContext;

  constructor(metadata: MessageMetadata, props: P) {
    super(metadata.id);

    this._messageType = metadata.messageType;
    this._context = metadata?.context ?? {};
    this._timestamp = metadata.timestamp ?? Date.now();

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
