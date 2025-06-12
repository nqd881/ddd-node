import { AnyEvent, EventClassWithTypedConstructor, EventSource } from "./event";
import { MessageBuilderBase } from "../message-base";
export declare class EventBuilder<T extends AnyEvent> extends MessageBuilderBase<T> {
    private eventClass;
    protected source?: EventSource;
    constructor(eventClass: EventClassWithTypedConstructor<T>);
    withSource(source: EventSource): this;
    build(): T;
}
