import _ from "lodash";
import { IIdService, Id, Uuid4Service } from "../../id";
import { ModelWithIdBuilder } from "../../model-with-id";
import {
  AnyMessage,
  MessageClassWithTypedConstructor,
  MessageContext,
} from "./message";

export abstract class MessageBuilderBase<
  T extends AnyMessage
> extends ModelWithIdBuilder<T> {
  protected _messageType?: string;
  protected _context?: MessageContext;
  protected _timestamp?: number;

  getTimestamp() {
    return !_.isUndefined(this._timestamp) ? this._timestamp : Date.now();
  }

  withMessageType(messageType: string) {
    this._messageType = messageType;

    return this;
  }

  withContext(context: MessageContext) {
    this._context = context;

    return this;
  }

  withTimestamp(timestamp: number) {
    this._timestamp = timestamp;

    return this;
  }
}

export class MessageBuilder<
  T extends AnyMessage
> extends MessageBuilderBase<T> {
  constructor(private messageClass: MessageClassWithTypedConstructor<T>) {
    super();
  }

  build() {
    if (!this._messageType)
      throw new Error("The message type must be set before build");

    if (!this._props) throw new Error("The props must be set before build");

    return new this.messageClass(
      {
        messageType: this._messageType,
        id: this.getId(),
        context: this._context,
        timestamp: this.getTimestamp(),
      },
      this._props
    );
  }
}
