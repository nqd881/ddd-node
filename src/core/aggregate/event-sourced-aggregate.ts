import { Class } from "type-fest";
import { getCommandHandlerMap, getEventApplierMap } from "../../meta";
import { ClassStatic } from "../../types";
import { toArray } from "../../utils";
import { Id } from "../id";
import {
  AnyCommand,
  AnyEvent,
  EventClassWithTypedConstructor,
} from "../message";
import { Props, PropsOf } from "../model";
import { AggregateBase, AggregateMetadata } from "./base";

export interface SnapshotMetadata extends AggregateMetadata {}

export interface Snapshot<T extends AnyEventSourcedAggregate> {
  metadata: SnapshotMetadata;
  props: PropsOf<T>;
}

export class EventSourcedAggregateBase<
  P extends Props
> extends AggregateBase<P> {
  private _handledCommands: AnyCommand[];
  private _pastEvents: AnyEvent[];
  private _events: AnyEvent[];

  constructor(metadata: AggregateMetadata, props?: P) {
    super(metadata, props);

    this._handledCommands = [];
    this._events = [];
    this._pastEvents = [];
  }

  static newStream<T extends AnyEventSourcedAggregate>(
    this: EventSourcedAggregateClassWithTypedConstructor<T>,
    id?: Id
  ) {
    return new this({
      id: this.id(id),
      version: 0,
    });
  }

  static fromStream<T extends AnyEventSourcedAggregate>(
    this: EventSourcedAggregateClassWithTypedConstructor<T>,
    id: Id,
    pastEvents: AnyEvent[] = []
  ) {
    const instance = this.newStream(id);

    instance.applyPastEvents(pastEvents);

    return instance;
  }

  static fromSnapshot<T extends AnyEventSourcedAggregate>(
    this: EventSourcedAggregateClassWithTypedConstructor<T>,
    snapshot: Snapshot<T>,
    pastEventsAfterSnapshot: AnyEvent[] = []
  ) {
    const { metadata, props } = snapshot;

    const instance = new this(metadata, props);

    instance.applyPastEvents(pastEventsAfterSnapshot);

    return instance;
  }

  static eventApplierMap<T extends AnyEventSourcedAggregate>(
    this: EventSourcedAggregateClass<T>
  ) {
    return getEventApplierMap(this.prototype);
  }

  static commandHandlerMap<T extends AnyEventSourcedAggregate>(
    this: EventSourcedAggregateClass<T>
  ) {
    return getCommandHandlerMap(this.prototype);
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

  eventApplierMap() {
    return (this.constructor as EventSourcedAggregateClass).eventApplierMap();
  }

  hasNewEvent() {
    return Boolean(this._events.length);
  }

  getApplierForEvent<E extends AnyEvent>(event: E) {
    const eventType = event.eventType();

    const applier = this.eventApplierMap().get(eventType);

    if (!applier) throw new Error("Event applier not found");

    return applier as EventApplier<E>;
  }

  private validateEventBeforeApply(event: AnyEvent) {
    const eventSource = event.source();

    if (eventSource.aggregate !== this.modelName())
      throw new Error("Invalid source type");

    if (!eventSource.id.equals(this._id)) throw new Error("Invalid source id");

    if (eventSource.version !== this.version())
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

  private applyPastEvents(pastEvents: AnyEvent[]) {
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

  commandHandlerMap() {
    return (this.constructor as EventSourcedAggregateClass).commandHandlerMap();
  }

  getHandlerForCommand<C extends AnyCommand>(command: C) {
    const commandType = command.commandType();

    const handler = this.commandHandlerMap().get(commandType);

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
