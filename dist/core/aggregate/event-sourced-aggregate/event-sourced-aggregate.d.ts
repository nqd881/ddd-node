import { Class } from "type-fest";
import { Props, InferredProps } from "../../../base";
import { ClassStatic } from "../../../types";
import { AnyCommand, AnyEvent, EventClassWithTypedConstructor } from "../../message";
import { AggregateBase, AggregateMetadata } from "../aggregate-base";
import { IAggregateEventPublisher } from "../aggregate-base";
import { EventSourcedAggregateModelDescriptor } from "./event-sourced-aggregate-model-descriptor";
import { Snapshot, SnapshotMetadata } from "./snapshot";
import { EventSourcedAggregateBuilder } from ".";
export interface EventSourceAggregateMetadata extends AggregateMetadata {
}
export declare class EventSourcedAggregateBase<P extends Props> extends AggregateBase<P> {
    static builder<T extends AnyEventSourcedAggregate>(this: EventSourcedAggregateClass<T>): EventSourcedAggregateBuilder<T>;
    private _handledCommands;
    private _pastEvents;
    private _events;
    constructor(metadata: EventSourceAggregateMetadata, props?: P);
    static ownEventApplierMap<T extends AnyEventSourcedAggregate>(this: EventSourcedAggregateClass<T>): import("../../../meta").EventApplierMap;
    static eventApplierMap<T extends AnyEventSourcedAggregate>(this: EventSourcedAggregateClass<T>): import("../../../meta").EventApplierMap;
    static ownCommandHandlerMap<T extends AnyEventSourcedAggregate>(this: EventSourcedAggregateClass<T>): import("../../../meta").CommandHandlerMap;
    static commandHandlerMap<T extends AnyEventSourcedAggregate>(this: EventSourcedAggregateClass<T>): import("../../../meta").CommandHandlerMap;
    modelDescriptor(): EventSourcedAggregateModelDescriptor<typeof this>;
    version(): number;
    pastEvents(): AnyEvent[];
    events(): AnyEvent[];
    handledCommands(): AnyCommand[];
    hasNewEvent(): boolean;
    getEventApplier<E extends AnyEvent>(event: E): EventApplier<E>;
    private validateEventBeforeApply;
    private _applyEvent;
    private applyPastEvent;
    applyPastEvents(pastEvents: AnyEvent[]): void;
    applyEvent<E extends AnyEvent>(event: E): void;
    applyEvents(events: AnyEvent[]): void;
    applyNewEvent<E extends AnyEvent>(eventClass: EventClassWithTypedConstructor<E>, props: InferredProps<E>): void;
    getCommandHandler<C extends AnyCommand>(command: C): CommandHandler<C, AnyEvent | AnyEvent[]>;
    handleCommand<C extends AnyCommand>(command: C): AnyEvent[];
    snapMetadata(): SnapshotMetadata;
    snap(): Snapshot<this>;
    protected archiveEvents(): void;
    publishEvents(publisher: IAggregateEventPublisher): void;
}
export type AnyEventSourcedAggregate = EventSourcedAggregateBase<Props>;
export interface EventSourcedAggregateClass<T extends AnyEventSourcedAggregate = AnyEventSourcedAggregate, Arguments extends unknown[] = any[]> extends Class<T, Arguments>, ClassStatic<typeof EventSourcedAggregateBase<InferredProps<T>>> {
}
export interface EventSourcedAggregateClassWithTypedConstructor<T extends AnyEventSourcedAggregate = AnyEventSourcedAggregate> extends EventSourcedAggregateClass<T, ConstructorParameters<typeof EventSourcedAggregateBase<InferredProps<T>>>> {
}
export type EventApplier<T extends AnyEvent = AnyEvent> = (event: T) => void;
export type CommandHandler<T extends AnyCommand = AnyCommand, U extends AnyEvent | AnyEvent[] = AnyEvent | AnyEvent[]> = (command: T) => U;
