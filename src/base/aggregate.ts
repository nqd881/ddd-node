import {
  getAggregateCommandHandler,
  getAggregateEventApplier,
  getAggregateType,
} from "#metadata/aggregate";
import { Class } from "#types/class";
import { ClassStatic } from "#types/class-static";
import { toArray } from "#utils/to-array";
import { AnyCommand } from "./command";
import { Entity, IEntityMetadata } from "./entity";
import {
  CommandHandlerNotFoundError,
  EventApplierNotFoundError,
  InvalidEventAggregateIdError,
  InvalidEventAggregateTypeError,
  InvalidEventAggregateVersionError,
  PastEventCannotBeAddedError,
} from "./errors/aggregate.error";
import { AnyEvent, EventClass, NewEventMetadataOptions } from "./event";
import { Id } from "./id";
import { PropsOf } from "./props-envelope";

export interface IAggregateMetadata extends IEntityMetadata {
  readonly version: number;
}

export class Aggregate<P extends object>
  extends Entity<P>
  implements IAggregateMetadata
{
  protected readonly _version: number;
  protected events: AnyEvent[] = [];

  constructor(metadata: IAggregateMetadata, props?: P) {
    super({ id: metadata.id }, props);

    this._version = metadata.version;
  }

  static aggregateType() {
    return getAggregateType(this.prototype);
  }

  static newAggregate<T extends AnyAggregate>(
    this: AggregateClass<T>,
    props?: PropsOf<T>
  ) {
    return new this(
      {
        id: Id.unique(),
        version: 0,
      },
      props
    );
  }

  get version() {
    return this._version;
  }

  aggregateType() {
    const prototype = Object.getPrototypeOf(this);

    return getAggregateType(prototype);
  }

  getEvents() {
    return this.events;
  }

  hasEvents() {
    return Boolean(this.events.length);
  }

  nextVersion() {
    return this.version + 1;
  }

  protected newEvent<E extends AnyEvent>(
    eventClass: EventClass<E>,
    props: PropsOf<E>,
    metadata?: NewEventMetadataOptions
  ) {
    return eventClass.newEvent(
      {
        id: this.id,
        type: this.aggregateType(),
        version: this.nextVersion(),
      },
      props,
      metadata
    );
  }

  protected addEvent<E extends AnyEvent>(event: E) {
    this.events.push(event);
  }
}

export interface SnapshotWithProps<P extends object> {
  metadata: IAggregateMetadata;
  props: P;
}

export interface Snapshot<T extends AnyAggregateES>
  extends SnapshotWithProps<PropsOf<T>> {}

export class AggregateES<P extends object> extends Aggregate<P> {
  protected handledCommands: AnyCommand[] = [];
  protected pastEvents: AnyEvent[] = [];

  static stream<T extends AnyAggregateES>(
    this: AggregateESClass<T>,
    id: Id,
    events: AnyEvent[]
  ) {
    const aggregate = new this({ id, version: 0 });

    aggregate.applyEvents(events, true);

    return aggregate;
  }

  static snapshot<T extends AnyAggregateES>(
    this: AggregateESClass<T>,
    snapshot: Snapshot<T>,
    eventsAfterSnapshot: AnyEvent[]
  ) {
    const { metadata, props } = snapshot;

    const aggregate = new this(metadata, props);

    aggregate.applyEvents(eventsAfterSnapshot, true);

    return aggregate;
  }

  getHandledCommands() {
    return this.handledCommands;
  }

  getPastEvents() {
    return this.pastEvents;
  }

  lastEvent() {
    return this.hasEvents() ? this.events.at(-1) : this.pastEvents.at(-1);
  }

  currentVersion() {
    const lastEvent = this.lastEvent();

    if (lastEvent) return lastEvent.aggregate.version;

    return this.version;
  }

  override nextVersion() {
    return this.currentVersion() + 1;
  }

  private addPastEvent<E extends AnyEvent>(event: E) {
    if (this.hasEvents()) throw new PastEventCannotBeAddedError();

    this.pastEvents.push(event);
  }

  private validateEventBeforeApply<E extends AnyEvent>(event: E) {
    const { type, id, version } = event.aggregate;

    if (type !== this.aggregateType())
      throw new InvalidEventAggregateTypeError();

    if (id !== this.id) throw new InvalidEventAggregateIdError();

    if (version !== this.nextVersion())
      throw new InvalidEventAggregateVersionError();
  }

  getEventApplier(eventType: string) {
    const prototype = Object.getPrototypeOf(this);

    const eventApplier = getAggregateEventApplier(prototype, eventType);

    if (eventApplier) return eventApplier.bind(this);

    return null;
  }

  applyEvent<E extends AnyEvent>(event: E, fromHistory = false) {
    const eventType = event.eventType();

    const applier = this.getEventApplier(eventType);

    if (!applier) throw new EventApplierNotFoundError(eventType);

    this.validateEventBeforeApply(event);

    if (fromHistory) this.addPastEvent(event);
    else this.addEvent(event);

    applier(event);
  }

  applyEvents(events: AnyEvent[], fromHistory = false) {
    events.forEach((event) => {
      this.applyEvent(event, fromHistory);
    });
  }

  getCommandHandler(commandType: string) {
    const prototype = Object.getPrototypeOf(this);

    const commandHandler = getAggregateCommandHandler(prototype, commandType);

    if (commandHandler) return commandHandler.bind(this);

    return null;
  }

  processCommand<C extends AnyCommand>(command: C) {
    const commandType = command.commandType();

    const handler = this.getCommandHandler(commandType);

    if (!handler) throw new CommandHandlerNotFoundError(commandType);

    const events = toArray(handler(command));

    const { correlationId, causationId } = command;

    events.forEach((event) => {
      if (correlationId) event.setCorrelationId(correlationId);
      if (causationId) event.setCausationId(causationId);

      this.applyEvent(event);
    });

    this.handledCommands.push(command);

    return events;
  }

  snap(): SnapshotWithProps<P> {
    return {
      metadata: {
        id: this.id,
        version: this.version,
      },
      props: this.getProps(),
    };
  }
}

export type AnyAggregate = Aggregate<any>;

export type AnyAggregateES = AggregateES<any>;

export type AggregateEventApplier<E extends AnyEvent> = (event: E) => void;

export type AggregateCommandHandler<
  C extends AnyCommand,
  E extends AnyEvent = AnyEvent
> = (command: C) => E | E[];

export type AggregateConstructorParamsWithProps<P extends object> =
  ConstructorParameters<typeof Aggregate<P>>;

export type AggregateClassWithProps<P extends object> = Class<
  Aggregate<P>,
  AggregateConstructorParamsWithProps<P>
> &
  ClassStatic<typeof Aggregate<P>>;

export type AggregateESClassWithProps<P extends object> = Class<
  AggregateES<P>,
  AggregateConstructorParamsWithProps<P>
> &
  ClassStatic<typeof AggregateES<P>>;

export type AggregateConstructorParams<T extends AnyAggregate> =
  AggregateConstructorParamsWithProps<PropsOf<T>>;

export type AggregateClass<T extends AnyAggregate> = Class<
  T,
  AggregateConstructorParams<T>
> &
  ClassStatic<typeof Aggregate<PropsOf<T>>>;

export type AggregateESClass<T extends AnyAggregateES> = Class<
  T,
  AggregateConstructorParams<T>
> &
  ClassStatic<typeof AggregateES<PropsOf<T>>>;

export type InferAggregateClass<T extends AnyAggregate> =
  T extends AnyAggregateES ? AggregateESClass<T> : AggregateClass<T>;

export type AnyAggregateClass = AggregateClass<AnyAggregate>;
