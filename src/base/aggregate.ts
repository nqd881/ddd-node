import {
  getAggregateCommandHandler,
  getAggregateEventApplier,
  getAggregateType,
} from "#metadata/aggregate";
import { Class } from "#types/class";
import { ClassStatic } from "#types/class-static";
import { v4 } from "uuid";
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
import {
  AnyEvent,
  EventClass,
  IEventAggregate,
  NewEventMetadataOptions,
} from "./event";
import { PropsOf } from "./props-envelope";

export interface IAggregateMetadata extends IEntityMetadata {
  readonly version: number;
}

export type NewAggregateMetadataOptions = Partial<
  Omit<IAggregateMetadata, "version">
>;

export class Aggregate<P extends object>
  extends Entity<P>
  implements IAggregateMetadata
{
  private readonly _version: number;

  private handledCommands: AnyCommand[] = [];
  private pastEvents: AnyEvent[] = [];
  private events: AnyEvent[] = [];

  constructor(metadata: IAggregateMetadata, props?: P) {
    super({ id: metadata.id }, props);

    this._version = metadata.version;
  }

  static agggregateType() {
    return getAggregateType(this.prototype);
  }

  static newAggregate<T extends AnyAggregate>(
    this: AggregateClass<T>,
    props?: PropsOf<T>,
    metadata?: NewAggregateMetadataOptions
  ) {
    return new this(
      {
        id: v4(),
        version: 0,
        ...metadata,
      },
      props
    );
  }

  static loadAggregate<T extends AnyAggregate>(
    this: AggregateClass<T>,
    id: string,
    version: number,
    props: PropsOf<T>,
    pastEvents?: AnyEvent[]
  ) {
    const aggregate = new this({ id, version }, props);

    if (pastEvents) aggregate.applyEvents(pastEvents, true);

    return aggregate;
  }

  get version() {
    return this._version;
  }

  aggregateType() {
    const prototype = Object.getPrototypeOf(this);

    return getAggregateType(prototype);
  }

  getHandledCommands() {
    return this.handledCommands;
  }

  getPastEvents() {
    return this.pastEvents;
  }

  getEvents() {
    return this.events;
  }

  hasEvents() {
    return Boolean(this.events.length);
  }

  lastEvent() {
    return this.hasEvents() ? this.events.at(-1) : this.pastEvents.at(-1);
  }

  lastEventVersion() {
    const lastEvent = this.lastEvent();

    if (lastEvent) return lastEvent.aggregate.version;

    return this.version;
  }

  nextEventVersion() {
    return this.lastEventVersion() + 1;
  }

  nextEventAggregate(): IEventAggregate {
    return {
      type: this.aggregateType(),
      id: this.id,
      version: this.nextEventVersion(),
    };
  }

  protected newEvent<E extends AnyEvent>(
    eventClass: EventClass<E>,
    props: PropsOf<E>,
    metadata?: NewEventMetadataOptions
  ) {
    return eventClass.newEvent(this.nextEventAggregate(), props, metadata);
  }

  protected addEvent<E extends AnyEvent>(event: E) {
    this.events.push(event);
  }

  protected addPastEvent<E extends AnyEvent>(event: E) {
    if (this.hasEvents()) throw new PastEventCannotBeAddedError();

    this.pastEvents.push(event);
  }

  getEventApplier(eventType: string) {
    const prototype = Object.getPrototypeOf(this);

    const eventApplier = getAggregateEventApplier(prototype, eventType);

    if (eventApplier) return eventApplier.bind(this);

    return null;
  }

  private validateEventBeforeApply<E extends AnyEvent>(event: E) {
    const { type, id, version } = event.aggregate;

    if (type !== this.aggregateType())
      throw new InvalidEventAggregateTypeError();

    if (id !== this.id) throw new InvalidEventAggregateIdError();

    if (version !== this.nextEventVersion())
      throw new InvalidEventAggregateVersionError();
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

  processCommands(commands: AnyCommand[]) {
    const result: Record<string, AnyEvent[]> = {};

    commands.forEach((command) => {
      const events = this.processCommand(command);

      result[command.id] = events;
    });

    return result;
  }
}

export type AnyAggregate = Aggregate<any>;

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

export type AggregateConstructorParams<T extends AnyAggregate> =
  AggregateConstructorParamsWithProps<PropsOf<T>>;

export type AggregateClass<T extends AnyAggregate> = Class<
  T,
  AggregateConstructorParams<T>
> &
  ClassStatic<typeof Aggregate<PropsOf<T>>>;

export type AnyAggregateClass = AggregateClass<AnyAggregate>;
