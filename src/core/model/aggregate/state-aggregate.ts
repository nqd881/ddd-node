import { Class } from "type-fest";
import { InferredProps, Props } from "../../../base";
import { ClassStatic } from "../../../types";
import { AnyEvent, EventClassWithTypedConstructor } from "../message";
import { Aggregate, AggregateMetadata } from "./aggregate";
import { IAggregateEventPublisher } from "./types";

export interface StateAggregateMetadata extends AggregateMetadata {}

export class StateAggregate<P extends Props> extends Aggregate<P> {
  static build<T extends AnyStateAggregate>(
    this: StateAggregateClassWithTypedConstructor<T>,
    props: InferredProps<T>,
    metadata?: Partial<StateAggregateMetadata>
  ) {
    return new this(this.createMetadata(metadata), props);
  }

  private _events: AnyEvent[];

  constructor(metadata: StateAggregateMetadata, props: P) {
    super(metadata, props);

    this._events = [];
  }

  _constructor() {
    return this.constructor as StateAggregateClass<typeof this>;
  }

  override props() {
    return super.props()!;
  }

  version() {
    return this._version;
  }

  events() {
    return Array.from(this._events);
  }

  protected recordEvent<E extends AnyEvent>(event: E): void;
  protected recordEvent<E extends AnyEvent>(
    eventClass: EventClassWithTypedConstructor<E>,
    props: InferredProps<E>
  ): void;
  protected recordEvent<E extends AnyEvent>(
    param1: E | EventClassWithTypedConstructor<E>,
    param2?: InferredProps<E>
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

  publishEvents<R = any>(publisher: IAggregateEventPublisher<R>) {
    const events = this.events();

    this.clearEvents();

    return publisher.publish(events);
  }
}

export type AnyStateAggregate = StateAggregate<Props>;

export interface StateAggregateClass<
  T extends AnyStateAggregate = AnyStateAggregate,
  Arguments extends unknown[] = any[]
> extends Class<T, Arguments>,
    ClassStatic<typeof StateAggregate<InferredProps<T>>> {}

export interface StateAggregateClassWithTypedConstructor<
  T extends AnyStateAggregate = AnyStateAggregate
> extends StateAggregateClass<
    T,
    ConstructorParameters<typeof StateAggregate<InferredProps<T>>>
  > {}
