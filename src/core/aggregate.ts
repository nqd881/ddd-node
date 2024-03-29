import { Class, ClassStatic } from "#types";
import { toArray } from "#utils";
import { Entity, EntityMetadata } from "./entity";

import { Id } from "./id";
import {
  AnyCommand,
  AnyEvent,
  EventClass,
  EventClassWithTypedConstructor,
  EventSource,
} from "./message";
import { getCommandHandlersMap, getEventAppliersMap } from "./metadata";
import { PropsOf } from "./model/model";

export interface AggregateBaseMetadata extends EntityMetadata {
  version: number;
}

export abstract class AggregateBase<
  Props extends object
> extends Entity<Props> {
  protected readonly _version: number;

  constructor(metadata: AggregateBaseMetadata, props?: Props) {
    super(metadata, props);

    this._version = metadata.version;
  }

  abstract getVersion(): number;

  protected newEvent<E extends AnyEvent>(
    eventClass: EventClassWithTypedConstructor<E>,
    props: PropsOf<E>
  ) {
    const eventSource: EventSource = {
      type: this.getType(),
      id: this.getId(),
      version: this.getVersion(),
    };

    return eventClass.newEvent(eventSource, props);
  }
}

export class Aggregate<Props extends object> extends AggregateBase<Props> {
  private _events: AnyEvent[];

  constructor(metadata: AggregateBaseMetadata, props: Props) {
    super(metadata, props);

    this._events = [];
  }

  static newAggregate<T extends AnyAggregate>(
    this: AggregateClassWithTypedConstructor<T>,
    props: PropsOf<T>,
    id?: Id
  ) {
    return new this(
      {
        id: this.id(id),
        version: 0,
      },
      props
    );
  }

  getVersion() {
    return this._version;
  }

  getEvents() {
    return this._events;
  }

  protected recordEvent<E extends AnyEvent>(event: E): void;
  protected recordEvent<E extends AnyEvent>(
    eventClass: EventClass<E>,
    props: PropsOf<E>
  ): void;
  protected recordEvent<E extends AnyEvent>(
    param1: E | EventClass<E>,
    param2?: PropsOf<E>
  ): void {
    let event: E;

    if (typeof param1 === "function" && param2) {
      event = this.newEvent(param1, param2);
    } else {
      event = param1 as E;
    }

    this._events.push(event);
  }

  clearEvents() {
    this._events = [];
  }
}

export interface SnapshotMetadata extends AggregateBaseMetadata {}

export interface Snapshot<T extends AnyAggregateES> {
  metadata: SnapshotMetadata;
  props: PropsOf<T>;
}

export class AggregateES<Props extends object> extends AggregateBase<Props> {
  private _handledCommands: AnyCommand[];
  private _pastEvents: AnyEvent[];
  private _events: AnyEvent[];

  constructor(metadata: AggregateBaseMetadata, props?: Props) {
    super(metadata, props);

    this._handledCommands = [];
    this._events = [];
    this._pastEvents = [];
  }

  static newStream<T extends AnyAggregateES>(
    this: AggregateESClassWithTypedConstructor<T>,
    id?: Id
  ) {
    return new this({
      id: this.id(id),
      version: 0,
    });
  }

  static fromStream<T extends AnyAggregateES>(
    this: AggregateESClassWithTypedConstructor<T>,
    id: Id,
    events: AnyEvent[] = []
  ) {
    const instance = this.newStream(id);

    instance.applyPastEvents(events);

    return instance;
  }

  static fromSnapshot<T extends AnyAggregateES>(
    this: AggregateESClassWithTypedConstructor<T>,
    snapshot: Snapshot<T>,
    events: AnyEvent[] = []
  ) {
    const { metadata, props } = snapshot;

    const instance = new this(metadata, props);

    instance.applyPastEvents(events);

    return instance;
  }

  static eventAppliersMap<T extends AnyAggregateES>(this: AggregateESClass<T>) {
    return getEventAppliersMap(this.prototype);
  }

  static commandHandlersMap<T extends AnyAggregateES>(
    this: AggregateESClass<T>
  ) {
    return getCommandHandlersMap(this.prototype);
  }

  getVersion() {
    return this._version + this._pastEvents.length + this._events.length;
  }

  getPastEvents() {
    return this._pastEvents;
  }

  getEvents() {
    return this._events;
  }

  getHandledCommands() {
    return this._handledCommands;
  }

  eventAppliersMap() {
    return (this.constructor as AggregateESClass).eventAppliersMap();
  }

  hasEvent() {
    return Boolean(this._events.length);
  }

  getApplierForEvent<E extends AnyEvent>(event: E) {
    const eventType = event.getType();

    const applier = this.eventAppliersMap().get(eventType);

    if (!applier) throw new Error("Event applier not found");

    return applier as EventApplier<E>;
  }

  private validateEventBeforeApply(event: AnyEvent) {
    const eventSource = event.getSource();

    if (eventSource.type !== this.getType())
      throw new Error("Invalid source type");

    if (!eventSource.id.equals(this._id)) throw new Error("Invalid source id");

    if (eventSource.version !== this.getVersion())
      throw new Error("Invalid source version");
  }

  private _applyEvent<E extends AnyEvent>(event: E) {
    const applier = this.getApplierForEvent(event);

    this.validateEventBeforeApply(event);

    applier.call(this, event);
  }

  private applyPastEvent<E extends AnyEvent>(event: E) {
    if (this.hasEvent()) throw new Error();

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

  commandHandlersMap() {
    return (this.constructor as AggregateESClass).commandHandlersMap();
  }

  getHandlerForCommand<C extends AnyCommand>(command: C) {
    const commandType = command.getType();

    const handler = this.commandHandlersMap().get(commandType);

    if (!handler) throw new Error("Command handler not found");

    return handler as CommandHandler<C>;
  }

  handleCommand<C extends AnyCommand>(command: C) {
    const handler = this.getHandlerForCommand(command);

    const events = toArray(handler.call(this, command));

    events.forEach((event) => {
      event.setContext({
        correlationId: command.getContext()?.correlationId,
        causationId: command.getId().value,
      });
    });

    this.applyEvents(events);

    this._handledCommands.push(command);

    return events;
  }

  snap() {
    if (!this._props) throw new Error();

    return {
      metadata: {
        id: this.getId(),
        version: this.getVersion(),
      },
      props: this.props(),
    } as Snapshot<typeof this>;
  }
}

export type AnyAggregate = Aggregate<any>;

export type AggregateClass<
  T extends AnyAggregate = AnyAggregate,
  Arguments extends unknown[] = any[]
> = Class<T, Arguments> & ClassStatic<typeof Aggregate<PropsOf<T>>>;

export type AggregateClassWithTypedConstructor<
  T extends AnyAggregate = AnyAggregate
> = AggregateClass<T, ConstructorParameters<typeof Aggregate<PropsOf<T>>>>;

export type AnyAggregateES = AggregateES<any>;

export type AggregateESClass<
  T extends AnyAggregateES = AnyAggregateES,
  Arguments extends unknown[] = any[]
> = Class<T, Arguments> & ClassStatic<typeof AggregateES<PropsOf<T>>>;

export type AggregateESClassWithTypedConstructor<
  T extends AnyAggregateES = AnyAggregateES
> = AggregateESClass<T, ConstructorParameters<typeof AggregateES<PropsOf<T>>>>;

export type EventApplier<T extends AnyEvent = AnyEvent> = (event: T) => void;

export type CommandHandler<
  T extends AnyCommand = AnyCommand,
  U extends AnyEvent | AnyEvent[] = AnyEvent
> = (command: T) => U;
