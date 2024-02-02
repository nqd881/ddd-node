import { Class } from "#types/class";
import { ClassStatic } from "#types/class-static";
import { toArray } from "#utils/to-array";
import { AnyCommand } from "./command";
import { Entity, EntityMetadata } from "./entity";
import {
  AnyEvent,
  EventClass,
  EventClassWithTypedConstructor,
  EventSource,
} from "./event";
import { Id, Uuid4 } from "./id";
import { getCommandHandlersMap, getEventAppliersMap } from "./metadata";
import { PropsOf } from "./model";

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

  abstract version: number;

  protected newEvent<E extends AnyEvent>(
    eventClass: EventClassWithTypedConstructor<E>,
    props: PropsOf<E>
  ) {
    const eventSource: EventSource = {
      type: this.type,
      id: this.id,
      version: this.version,
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
        id: id ?? Uuid4.new(),
        version: 0,
      },
      props
    );
  }

  get version() {
    return this._version;
  }

  get events() {
    return this._events;
  }

  recordEvent<E extends AnyEvent>(event: E): void;
  recordEvent<E extends AnyEvent>(
    eventClass: EventClass<E>,
    props: PropsOf<E>
  ): void;
  recordEvent<E extends AnyEvent>(
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
      id: id ?? Uuid4.new(),
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

  get version() {
    return (
      this._version +
      (this.hasEvent() ? this._events.length : this._pastEvents.length)
    );
  }

  get events() {
    return this._events;
  }

  get handledCommands() {
    return this._handledCommands;
  }

  eventAppliersMap() {
    return (this.constructor as AggregateESClass).eventAppliersMap();
  }

  hasEvent() {
    return Boolean(this._events.length);
  }

  getApplierForEvent<E extends AnyEvent>(event: E) {
    const { type } = event;

    const applier = this.eventAppliersMap().get(type);

    if (!applier) throw new Error("Event applier not found");

    return applier as EventApplier<E>;
  }

  private validateEventBeforeApply(event: AnyEvent) {
    const { source } = event;

    if (source.type !== this.type) throw new Error("Invalid source type");

    if (!source.id.equals(this.id)) throw new Error("Invalid source id");

    if (source.version !== this.version)
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
    const { type } = command;

    const handler = this.commandHandlersMap().get(type);

    if (!handler) throw new Error("Command handler not found");

    return handler as CommandHandler<C>;
  }

  handleCommand<C extends AnyCommand>(command: C) {
    const handler = this.getHandlerForCommand(command);

    const events = toArray(handler.call(this, command));

    events.forEach((event) => {
      event.setContext({
        correlationId: command.context?.correlationId,
        causationId: command.id.value,
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
        id: this.id,
        version: this.version,
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
