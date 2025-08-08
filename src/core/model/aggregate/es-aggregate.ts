import { Id } from "src";
import { Class } from "type-fest";
import { InferredProps, Props } from "../../../base";
import { ClassStatic } from "../../../types";
import { toArray } from "../../../utils";
import {
  getCommandHandlerMap,
  getEventApplierMap,
  getOwnCommandHandlerMap,
  getOwnEventApplierMap,
} from "../../meta";
import {
  AnyCommand,
  AnyEvent,
  EventClassWithTypedConstructor,
} from "../message";
import { Aggregate, AggregateMetadata } from "./aggregate";
import { IAggregateEventPublisher } from "./types";

export class ESAggregate<P extends Props> extends Aggregate<P> {
  static fromStream<T extends AnyESAggregate>(
    this: ESAggregateClassWithTypedConstructor<T>,
    pastEvents: AnyEvent[],
    id?: Id
  ) {
    const instance = new this(this.createMetadata({ id }));

    instance.applyPastEvents(pastEvents);

    return instance;
  }

  static newStream<T extends AnyESAggregate>(
    this: ESAggregateClassWithTypedConstructor<T>,
    id?: Id
  ) {
    return this.fromStream([], id);
  }

  static fromSnapshot<T extends AnyESAggregate>(
    this: ESAggregateClassWithTypedConstructor<T>,
    snapshot: Snapshot<T>,
    pastEvents: AnyEvent[] = []
  ) {
    const { id, version } = snapshot.metadata;
    const { props } = snapshot;

    const instance = new this(
      {
        id,
        version,
      },
      props
    );

    instance.applyPastEvents(pastEvents);

    return instance;
  }

  static ownEventApplierMap<T extends AnyESAggregate>(
    this: ESAggregateClass<T>
  ) {
    return getOwnEventApplierMap(this.prototype);
  }

  static eventApplierMap<T extends AnyESAggregate>(this: ESAggregateClass<T>) {
    return getEventApplierMap(this.prototype);
  }

  static ownCommandHandlerMap<T extends AnyESAggregate>(
    this: ESAggregateClass<T>
  ) {
    return getOwnCommandHandlerMap(this.prototype);
  }

  static commandHandlerMap<T extends AnyESAggregate>(
    this: ESAggregateClass<T>
  ) {
    return getCommandHandlerMap(this.prototype);
  }

  private _handledCommands: AnyCommand[];
  private _pastEvents: AnyEvent[];
  private _events: AnyEvent[];

  constructor(metadata: AggregateMetadata, props?: P) {
    super(metadata, props);

    this._handledCommands = [];
    this._events = [];
    this._pastEvents = [];
  }

  _constructor() {
    return this.constructor as ESAggregateClass<typeof this>;
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
    const eventType = event.eventType();
    const eventApplierMap = this._constructor().eventApplierMap();

    const applier = eventApplierMap.get(eventType);

    if (!applier) throw new Error("IsEvent applier not found");

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
    const commandType = command.commandType();
    const commandHandlerMap = this._constructor().commandHandlerMap();

    const handler = commandHandlerMap.get(commandType);

    if (!handler) throw new Error("IsCommand handler not found");

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

  takeSnapshot() {
    if (this.propsIsEmpty())
      throw new Error(
        "Cannot create snapshot when the props is not initialized"
      );

    return {
      metadata: this.metadata(),
      props: this.props()!,
    } as Snapshot<typeof this>;
  }

  protected commitEvents() {
    const events = this.events();

    this._events = [];
    this._pastEvents.push(...events);
  }

  publishEvents(publisher: IAggregateEventPublisher): void {
    publisher.publish(this.events());

    this.commitEvents();
  }
}

export type AnyESAggregate = ESAggregate<Props>;

export interface ESAggregateClass<
  T extends AnyESAggregate = AnyESAggregate,
  Arguments extends unknown[] = any[]
> extends Class<T, Arguments>,
    ClassStatic<typeof ESAggregate<InferredProps<T>>> {}

export interface ESAggregateClassWithTypedConstructor<
  T extends AnyESAggregate = AnyESAggregate
> extends ESAggregateClass<
    T,
    ConstructorParameters<typeof ESAggregate<InferredProps<T>>>
  > {}

export type EventApplier<T extends AnyEvent = AnyEvent> = (event: T) => void;

export type CommandHandler<
  T extends AnyCommand = AnyCommand,
  U extends AnyEvent | AnyEvent[] = AnyEvent | AnyEvent[]
> = (command: T) => U;

export interface Snapshot<T extends AnyESAggregate> {
  metadata: AggregateMetadata;
  props: InferredProps<T>;
}
