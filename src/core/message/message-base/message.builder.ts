import { IdentifiableModelBuilder } from "../../identifiable-model";
import {
  AnyMessage,
  MessageClassWithTypedConstructor,
  MessageContext,
} from "./message";

export abstract class MessageBuilderBase<
  T extends AnyMessage
> extends IdentifiableModelBuilder<T> {
  protected timestamp: number = Date.now();
  protected context?: MessageContext;

  withContext(context?: MessageContext) {
    this.context = context;
    return this;
  }

  withTimestamp(timestamp: number) {
    this.timestamp = timestamp;
    return this;
  }

  withTimestampNow() {
    return this.withTimestamp(Date.now());
  }
}

export class MessageBuilder<
  T extends AnyMessage
> extends MessageBuilderBase<T> {
  constructor(private messageClass: MessageClassWithTypedConstructor<T>) {
    super();
  }

  build() {
    if (!this.props) throw new Error("The props must be set before build");

    return new this.messageClass(
      {
        id: this.id,
        context: this.context,
        timestamp: this.timestamp,
      },
      this.props
    );
  }
}
