import { Class } from "type-fest";
import { Props, PropsOf } from "../../../model";
import { ClassStatic } from "../../../types";
import { toArray } from "../../../utils";
import {
  AnyCommand,
  AnyEvent,
  EventClassWithTypedConstructor,
} from "../../message";
import { AggregateBase, AggregateMetadata } from "../aggregate-base";
import { IEventDispatcher } from "../event-dispatcher.interface";
import { ESAModelMetadata } from "./event-sourced-aggregate.model-metadata";

export type EventSourceAggregateMetadata = Omit<
  AggregateMetadata,
  "aggregateType"
>;

export interface SnapshotMetadata extends EventSourceAggregateMetadata {}

export interface Snapshot<T extends AnyEventSourcedAggregate> {
  metadata: SnapshotMetadata;
  props: PropsOf<T>;
}

export class EventSourcedAggregateBase<
  P extends Props
> extends AggregateBase<P> {
  static readonly AGGREGATE_TYPE = "event_sourced";

  private _handledCommands: AnyCommand[];
  private _pastEvents: AnyEvent[];
  private _events: AnyEvent[];

  constructor(metadata: EventSourceAggregateMetadata, props?: P) {
    super(
      { ...metadata, aggregateType: EventSourcedAggregateBase.AGGREGATE_TYPE },
      props
    );

    this._handledCommands = [];
    this._events = [];
    this._pastEvents = [];
  }

  static esaModelMetadata<T extends AnyEventSourcedAggregate>(
    this: EventSourcedAggregateClass<T>
  ) {
    return new ESAModelMetadata(this);
  }

  esaModelMetadata() {
    return (
      this.constructor as EventSourcedAggregateClass<typeof this>
    ).esaModelMetadata();
  }

  version() {
    return this._version + this._pastEvents.length + this._events.length;
  }

  pastEvents() {
    return Array.from(this._pastEvents);
  }

  events() {
    return Array.from(this._events);
  }

  handledCommands() {
    return Array.from(this._handledCommands);
  }

  hasNewEvent() {
    return Boolean(this._events.length);
  }

  getApplierForEvent<E extends AnyEvent>(event: E) {
    const { eventType } = event.eventModelMetadata();
    const { eventApplierMap } = this.esaModelMetadata();

    const applier = eventApplierMap.get(eventType);

    if (!applier) throw new Error("Event applier not found");

    return applier as EventApplier<E>;
  }

  private validateEventBeforeApply(event: AnyEvent) {
    const eventSource = event.source();

    if (eventSource.aggregateModelId !== this.modelMetadata().modelId)
      throw new Error("Invalid source type");

    if (!eventSource.aggregateId.equals(this._id))
      throw new Error("Invalid source id");

    if (eventSource.aggregateVersion !== this.version())
      throw new Error("Invalid source version");
  }

  private _applyEvent<E extends AnyEvent>(event: E) {
    const applier = this.getApplierForEvent(event);

    this.validateEventBeforeApply(event);

    applier.call(this, event);
  }

  private applyPastEvent<E extends AnyEvent>(event: E) {
    if (this.hasNewEvent()) throw new Error();

    this._applyEvent(event);

    this._pastEvents.push(event);
  }

  applyPastEvents(pastEvents: AnyEvent[]) {
    pastEvents.forEach((pastEvent) => {
      this.applyPastEvent(pastEvent);
    });
  }

  applyEvent<E extends AnyEvent>(event: E) {
    this._applyEvent(event);

    this._events.push(event);
  }

  applyEvents(events: AnyEvent[]) {
    events.forEach((event) => {
      this.applyEvent(event);
    });
  }

  applyNewEvent<E extends AnyEvent>(
    eventClass: EventClassWithTypedConstructor<E>,
    props: PropsOf<E>
  ) {
    this.applyEvent(this.newEvent(eventClass, props));
  }

  getHandlerForCommand<C extends AnyCommand>(command: C) {
    const { commandType } = command.commandModelMetadata();
    const { commandHandlerMap } = this.esaModelMetadata();

    const handler = commandHandlerMap.get(commandType);

    if (!handler) throw new Error("Command handler not found");

    return handler as CommandHandler<C>;
  }

  handleCommand<C extends AnyCommand>(command: C) {
    const handler = this.getHandlerForCommand(command);

    const events = toArray(handler.call(this, command));

    events.forEach((event) => {
      event.setContext({
        correlationId: command.context()?.correlationId,
        causationId: command.id().value,
      });
    });

    this.applyEvents(events);

    this._handledCommands.push(command);

    return events;
  }

  snapMetadata(): SnapshotMetadata {
    return {
      id: this.id(),
      version: this.version(),
    };
  }

  snap() {
    if (this.propsIsEmpty())
      throw new Error(
        "Cannot create snapshot when the props is not initialized"
      );

    return {
      metadata: this.snapMetadata(),
      props: this.props(),
    } as Snapshot<typeof this>;
  }

  protected archiveEvents() {
    const events = this.events();

    this._events = [];
    this._pastEvents.push(...events);
  }

  dispatchEvents(dispatcher: IEventDispatcher): void {
    this.events().forEach((event) => {
      dispatcher.dispatch(event);
    });

    this.archiveEvents();
  }
}

export type AnyEventSourcedAggregate = EventSourcedAggregateBase<Props>;

export interface EventSourcedAggregateClass<
  T extends AnyEventSourcedAggregate = AnyEventSourcedAggregate,
  Arguments extends unknown[] = any[]
> extends Class<T, Arguments>,
    ClassStatic<typeof EventSourcedAggregateBase<PropsOf<T>>> {}

export interface EventSourcedAggregateClassWithTypedConstructor<
  T extends AnyEventSourcedAggregate = AnyEventSourcedAggregate
> extends EventSourcedAggregateClass<
    T,
    ConstructorParameters<typeof EventSourcedAggregateBase<PropsOf<T>>>
  > {}

export type EventApplier<T extends AnyEvent = AnyEvent> = (event: T) => void;

export type CommandHandler<
  T extends AnyCommand = AnyCommand,
  U extends AnyEvent | AnyEvent[] = AnyEvent | AnyEvent[]
> = (command: T) => U;
