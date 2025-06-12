import { ModelWithIdBuilder } from "../../model-with-id";
import { AnyMessage, CorrelationIds, MessageClassWithTypedConstructor } from "./message";
export declare abstract class MessageBuilderBase<T extends AnyMessage> extends ModelWithIdBuilder<T> {
    protected timestamp: number;
    protected causationId?: string;
    protected correlationIds: CorrelationIds;
    withCausationId(causationId: string): this;
    withCorrelationIds(correlationIds: CorrelationIds): this;
    withTimestamp(timestamp: number): this;
    withTimestampNow(): this;
}
export declare class MessageBuilder<T extends AnyMessage> extends MessageBuilderBase<T> {
    private messageClass;
    constructor(messageClass: MessageClassWithTypedConstructor<T>);
    build(): T;
}
