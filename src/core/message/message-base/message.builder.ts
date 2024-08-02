import { IdentifiableModelBuilder } from "../../identifiable-model";
import {
  AnyMessage,
  CorrelationIds,
  MessageClassWithTypedConstructor,
} from "./message";

export abstract class MessageBuilderBase<
  T extends AnyMessage
> extends IdentifiableModelBuilder<T> {
  protected timestamp: number = Date.now();
  protected causationId?: string;
  protected correlationIds: CorrelationIds = {};

  withCausationId(causationId: string) {
    this.causationId = causationId;
    return this;
  }

  withCorrelationIds(correlationIds: CorrelationIds) {
    this.correlationIds = correlationIds;
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
        timestamp: this.timestamp,
        correlationIds: this.correlationIds,
        causationId: this.causationId,
      },
      this.props
    );
  }
}
