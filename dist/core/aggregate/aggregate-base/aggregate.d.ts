import { Props, InferredProps } from "../../../base";
import { ModelWithId, ModelWithIdMetadata } from "../../model-with-id";
import { AnyEvent, EventClassWithTypedConstructor, EventSource } from "../../message";
import { IAggregateEventPublisher } from "./aggregate-event-publisher.interface";
export interface AggregateMetadata extends ModelWithIdMetadata {
    version: number;
}
export declare abstract class AggregateBase<P extends Props> extends ModelWithId<P> {
    protected readonly _version: number;
    constructor(metadata: AggregateMetadata, props?: P);
    abstract version(): number;
    metadata(): AggregateMetadata;
    protected createEventSource(): EventSource;
    protected newEvent<E extends AnyEvent>(eventClass: EventClassWithTypedConstructor<E>, props: InferredProps<E>): E;
    abstract publishEvents(publisher: IAggregateEventPublisher): void;
}
export type AnyAggregate = AggregateBase<Props>;
