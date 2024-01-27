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
  InvalidCommandAggregateTypeError,
  InvalidEventAggregateIdError,
  InvalidEventAggregateTypeError,
  InvalidEventAggregateVersionError,
  PastEventCannotBeAddedError,
} from "./errors/aggregate.error";
import { AnyEvent, EventClass, NewEventMetadataOptions } from "./event";
import { Id } from "./id";
import { PropsOf } from "./props-envelope";

export interface IAggregateMetadata extends IEntityMetadata {
  readonly aggregateType: string;
  readonly version: number;
}

export type AggregateMetadataWithoutEntityType = Omit<
  IAggregateMetadata,
  "entityType"
>;

export type NewAggregateMetadata = Partial<
  Omit<IAggregateMetadata, "aggregateType">
>;

export class Aggregate<P extends object>
  extends Entity<P>
  implements IAggregateMetadata
{
  private readonly _aggregateType: string;
  protected readonly _version: number;
  protected events: AnyEvent[] = [];

  constructor(metadata: AggregateMetadataWithoutEntityType, props?: P) {
    super({ id: metadata.id, entityType: "" }, props);

    this._aggregateType = metadata.aggregateType;
    this._version = metadata.version;
  }

  static aggregateType() {
    return getAggregateType(this.prototype);
  }

  static newAggregate<T extends AnyAggregate>(
    this: AggregateClass<T>,
    props?: PropsOf<T>,
    metadata?: NewAggregateMetadata
  ) {
    return new this(
      {
        aggregateType: this.aggregateType(),
        id: Id.unique(),
        version: 0,
        ...metadata,
      },
      props
    );
  }

  get version() {
    return this._version;
  }

  get aggregateType() {
    return this._aggregateType;
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
        version: this.nextVersion(),
      },
      props,
      metadata
    );
  }

  protected addEvent<E extends AnyEvent>(event: E) {
    this.events.push(event);
  }

  protected addNewEvent<E extends AnyEvent>(
    eventClass: EventClass<E>,
    props: PropsOf<E>,
    metadata?: NewEventMetadataOptions
  ) {
    const event = this.newEvent(eventClass, props, metadata);

    this.addEvent(event);
  }
}

export type SnapshotAggregateMetadata = AggregateMetadataWithoutEntityType;

export interface SnapshotWithProps<P extends object> {
  metadata: SnapshotAggregateMetadata;
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
    const aggregate = this.newAggregate(undefined, { id });

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
    const { aggregateType } = event;
    const { id, version } = event.aggregate;

    if (aggregateType !== this.aggregateType)
      throw new InvalidEventAggregateTypeError();

    if (!id.equals(this.id)) throw new InvalidEventAggregateIdError();

    if (version !== this.nextVersion())
      throw new InvalidEventAggregateVersionError();
  }

  getEventApplierSafe(eventType: string) {
    const prototype = Object.getPrototypeOf(this);

    const eventApplier = getAggregateEventApplier(prototype, eventType);

    if (eventApplier) return eventApplier.bind(this);

    return null;
  }

  getEventApplier(eventType: string) {
    const applier = this.getEventApplierSafe(eventType);

    if (!applier) throw new EventApplierNotFoundError(eventType);

    return applier;
  }

  applyEvent<E extends AnyEvent>(event: E, fromHistory = false) {
    const { eventType } = event;

    const applier = this.getEventApplier(eventType);

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

  getCommandHandlerSafe(commandType: string) {
    const prototype = Object.getPrototypeOf(this);

    const commandHandler = getAggregateCommandHandler(prototype, commandType);

    if (commandHandler) return commandHandler.bind(this);

    return null;
  }

  getCommandHandler(commandType: string) {
    const handler = this.getCommandHandlerSafe(commandType);

    if (!handler) throw new CommandHandlerNotFoundError(commandType);

    return handler;
  }

  private validateCommandBeforeProcess<C extends AnyCommand>(command: C) {
    const { aggregateType } = command;

    if (aggregateType !== this.aggregateType)
      throw new InvalidCommandAggregateTypeError();
  }

  processCommand<C extends AnyCommand>(command: C) {
    const { commandType } = command;

    const handler = this.getCommandHandler(commandType);

    this.validateCommandBeforeProcess(command);

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
        aggregateType: this.aggregateType,
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

export type AnyAggregateClass = Class<AnyAggregate>;
