import _ from "lodash";
import { Id } from "./id";
import { Model } from "./model";

export interface MessageContext {
  correlationId?: string;
  causationId?: string;
}

export interface MessageMetadata {
  readonly id: Id;
  readonly timestamp: number;
  context?: MessageContext;
}

export class Message<Props extends object> extends Model<Props> {
  private readonly _id: Id;
  private readonly _timestamp: number;
  private _context?: MessageContext;

  protected constructor(metadata: MessageMetadata, props: Props) {
    super(props);

    this._id = metadata.id;
    this._timestamp = metadata.timestamp;
    this._context = metadata?.context ?? {};
  }

  getId() {
    return this._id;
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
