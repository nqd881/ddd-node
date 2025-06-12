import { Class } from "type-fest";
import { EventType } from "../../../meta";
import { Props, InferredProps } from "../../../base";
import { ClassStatic } from "../../../types";
import { Id } from "../../model-with-id";
import { MessageBase, MessageMetadata } from "../message-base";
import { EventModelDescriptor } from "./event-model-descriptor";
import { EventBuilder } from ".";
export type EventSource = Readonly<{
    aggregateId: Id;
    aggregateVersion: number;
}>;
export interface EventMetadata extends MessageMetadata {
    eventType: EventType;
    source: EventSource;
}
export declare class EventBase<P extends Props> extends MessageBase<P> {
    static builder<T extends AnyEvent>(this: EventClass<T>): EventBuilder<T>;
    private readonly _eventType;
    private readonly _source;
    constructor(metadata: Omit<EventMetadata, "eventType">, props: P);
    static eventType(): EventType;
    modelDescriptor(): EventModelDescriptor<typeof this>;
    metadata(): EventMetadata;
    eventType(): string;
    source(): Readonly<{
        aggregateId: string;
        aggregateVersion: number;
    }>;
}
export type AnyEvent = EventBase<Props>;
export interface EventClass<T extends AnyEvent = AnyEvent, Arguments extends unknown[] = any[]> extends Class<T, Arguments>, ClassStatic<typeof EventBase<InferredProps<T>>> {
}
export interface EventClassWithTypedConstructor<T extends AnyEvent = AnyEvent> extends EventClass<T, ConstructorParameters<typeof EventBase<InferredProps<T>>>> {
}
