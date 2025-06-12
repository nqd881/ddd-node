import { Class } from "type-fest";
import { Props, InferredProps } from "../../../base";
import { ClassStatic } from "../../../types";
import { ModelWithId, ModelWithIdMetadata } from "../../model-with-id";
export interface CorrelationIds {
    [type: string]: string | undefined;
}
export interface MessageMetadata extends ModelWithIdMetadata {
    timestamp: number;
    causationId?: string;
    correlationIds: CorrelationIds;
}
export declare class MessageBase<P extends Props> extends ModelWithId<P> {
    private readonly _timestamp;
    private _causationId?;
    private _correlationIds;
    constructor(metadata: MessageMetadata, props: P);
    props(): P;
    metadata(): MessageMetadata;
    timestamp(): number;
    correlationIds(): CorrelationIds;
    causationId(): string | undefined;
    setCausationId(causationId: string): void;
    addCorrelationId(type: string, correlationId: string): void;
    setCorrelationIds(correlationIds: CorrelationIds): void;
}
export type AnyMessage = MessageBase<Props>;
export interface MessageClass<T extends AnyMessage = AnyMessage, Arguments extends unknown[] = any[]> extends Class<T, Arguments>, ClassStatic<typeof MessageBase<InferredProps<T>>> {
}
export interface MessageClassWithTypedConstructor<T extends AnyMessage = AnyMessage> extends MessageClass<T, ConstructorParameters<typeof MessageBase<InferredProps<T>>>> {
}
