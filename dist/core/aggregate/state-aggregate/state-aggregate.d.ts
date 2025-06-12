import { Class } from "type-fest";
import { Props, InferredProps } from "../../../base";
import { ClassStatic } from "../../../types";
import { AnyEvent, EventClassWithTypedConstructor } from "../../message";
import { AggregateBase, AggregateMetadata, IAggregateEventPublisher } from "../aggregate-base";
import { StateAggregateBuilder } from ".";
export interface StateAggregateMetadata extends AggregateMetadata {
}
export declare class StateAggregateBase<P extends Props> extends AggregateBase<P> {
    static builder<T extends AnyStateAggregate>(this: StateAggregateClass<T>): StateAggregateBuilder<T>;
    private _events;
    constructor(metadata: StateAggregateMetadata, props: P);
    props(): P;
    version(): number;
    events(): AnyEvent[];
    protected recordEvent<E extends AnyEvent>(event: E): void;
    protected recordEvent<E extends AnyEvent>(eventClass: EventClassWithTypedConstructor<E>, props: InferredProps<E>): void;
    clearEvents(): void;
    publishEvents(publisher: IAggregateEventPublisher): void;
}
export type AnyStateAggregate = StateAggregateBase<Props>;
export interface StateAggregateClass<T extends AnyStateAggregate = AnyStateAggregate, Arguments extends unknown[] = any[]> extends Class<T, Arguments>, ClassStatic<typeof StateAggregateBase<InferredProps<T>>> {
}
export interface StateAggregateClassWithTypedConstructor<T extends AnyStateAggregate = AnyStateAggregate> extends StateAggregateClass<T, ConstructorParameters<typeof StateAggregateBase<InferredProps<T>>>> {
}
