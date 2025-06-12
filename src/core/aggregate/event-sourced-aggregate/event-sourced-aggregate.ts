import { Class } from "type-fest";
import {
  getCommandHandlerMap,
  getEventApplierMap,
  getOwnCommandHandlerMap,
  getOwnEventApplierMap,
} from "../../../meta";
import { Props, InferredProps } from "../../../base";
import { ClassStatic } from "../../../types";
import { toArray } from "../../../utils";
import {
  AnyCommand,
  AnyEvent,
  EventClassWithTypedConstructor,
} from "../../message";
import { AggregateBase, AggregateMetadata } from "../aggregate-base";
import { IAggregateEventPublisher } from "../aggregate-base";
import { EventSourcedAggregateModelDescriptor } from "./event-sourced-aggregate-model-descriptor";
import { Snapshot, SnapshotMetadata } from "./snapshot";
import { EventSourcedAggregateBuilder } from ".";

export interface EventSourceAggregateMetadata extends AggregateMetadata {}

export class EventSourcedAggregateBase<
  P extends Props
> extends AggregateBase<P> {
  static builder<T extends AnyEventSourcedAggregate>(
    this: EventSourcedAggregateClass<T>
  ): EventSourcedAggregateBuilder<T> {
    return new EventSourcedAggregateBuilder(this);
  }

  private _handledCommands: AnyCommand[];
  private _pastEvents: AnyEvent[];
  private _events: AnyEvent[];

  constructor(metadata: EventSourceAggregateMetadata, props?: P) {
    super(metadata, props);

    this._handledCommands = [];
    this._events = [];
    this._pastEvents = [];
  }

  static ownEventApplierMap<T extends AnyEventSourcedAggregate>(
    this: EventSourcedAggregateClass<T>
  ) {
    return getOwnEventApplierMap(this.prototype);
  }

  static eventApplierMap<T extends AnyEventSourcedAggregate>(
    this: EventSourcedAggregateClass<T>
  ) {
    return getEventApplierMap(this.prototype);
  }

  static ownCommandHandlerMap<T extends AnyEventSourcedAggregate>(
    this: EventSourcedAggregateClass<T>
  ) {
    return getOwnCommandHandlerMap(this.prototype);
  }

  static commandHandlerMap<T extends AnyEventSourcedAggregate>(
    this: EventSourcedAggregateClass<T>
  ) {
    return getCommandHandlerMap(this.prototype);
  }

  modelDescriptor(): EventSourcedAggregateModelDescriptor<typeof this> {
    const aggregateClass = this.constructor as EventSourcedAggregateClass;

    return {
      ...super.modelDescriptor(),
      ownEventApplierMap: aggregateClass.ownEventApplierMap(),
      eventApplierMap: aggregateClass.eventApplierMap(),
      ownCommandHandlerMap: aggregateClass.ownCommandHandlerMap(),
      commandHandlerMap: aggregateClass.commandHandlerMap(),
    };
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

  getEventApplier<E extends AnyEvent>(event: E) {
    const { eventType } = event.modelDescriptor();
    const { eventApplierMap } = this.modelDescriptor();

    const applier = eventApplierMap.get(eventType);

    if (!applier) throw new Error("Event applier not found");

    return applier as EventApplier<E>;
  }

  private validateEventBeforeApply(event: AnyEvent) {
    const { aggregateId, aggregateVersion } = event.source();

    if (aggregateId !== this._id) throw new Error("Invalid aggregate id");

    if (aggregateVersion !== this.version())
      throw new Error("Invalid aggregate version");
  }

  private _applyEvent<E extends AnyEvent>(event: E) {
    const applier = this.getEventApplier(event);

    this.validateEventBeforeApply(event);

    applier.call(this, event);
  }

  private applyPastEvent<E extends AnyEvent>(event: E) {
    if (this.hasNewEvent())
      throw new Error("Cannot apply a past event when new event is recorded");

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
    props: InferredProps<E>
  ) {
    this.applyEvent(this.newEvent(eventClass, props));
  }

  getCommandHandler<C extends AnyCommand>(command: C) {
    const { commandType } = command.modelDescriptor();
    const { commandHandlerMap } = this.modelDescriptor();

    const handler = commandHandlerMap.get(commandType);

    if (!handler) throw new Error("Command handler not found");

    return handler as CommandHandler<C>;
  }

  handleCommand<C extends AnyCommand>(command: C) {
    const handler = this.getCommandHandler(command);

    const events = toArray(handler.call(this, command));

    events.forEach((event) => {
      event.setCausationId(command.id());
      event.setCorrelationIds(command.correlationIds());
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
      props: this.props()!,
    } as Snapshot<typeof this>;
  }

  protected archiveEvents() {
    const events = this.events();

    this._events = [];
    this._pastEvents.push(...events);
  }

  publishEvents(publisher: IAggregateEventPublisher): void {
    publisher.publish(this.events());

    this.archiveEvents();
  }
}

export type AnyEventSourcedAggregate = EventSourcedAggregateBase<Props>;

export interface EventSourcedAggregateClass<
  T extends AnyEventSourcedAggregate = AnyEventSourcedAggregate,
  Arguments extends unknown[] = any[]
> extends Class<T, Arguments>,
    ClassStatic<typeof EventSourcedAggregateBase<InferredProps<T>>> {}

export interface EventSourcedAggregateClassWithTypedConstructor<
  T extends AnyEventSourcedAggregate = AnyEventSourcedAggregate
> extends EventSourcedAggregateClass<
    T,
    ConstructorParameters<typeof EventSourcedAggregateBase<InferredProps<T>>>
  > {}

export type EventApplier<T extends AnyEvent = AnyEvent> = (event: T) => void;

export type CommandHandler<
  T extends AnyCommand = AnyCommand,
  U extends AnyEvent | AnyEvent[] = AnyEvent | AnyEvent[]
> = (command: T) => U;
