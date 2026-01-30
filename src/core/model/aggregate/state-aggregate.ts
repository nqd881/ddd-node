import { Class } from "type-fest";
import { v4 } from "uuid";
import { InferredProps, Props } from "../../../base";
import { ClassStatic } from "../../../types";
import { Id } from "../identified-model";
import {
  AnyEvent,
  EventClassWithTypedConstructor,
  NewEventOptions,
} from "../message";
import { Aggregate } from "./aggregate";

export class StateAggregate<P extends Props> extends Aggregate<P> {
  static new<T extends AnyStateAggregate>(
    this: StateAggregateClassWithTypedConstructor<T>,
    props: InferredProps<T>,
    id?: Id
  ) {
    return new this(id ?? v4(), 0, props);
  }

  private _events: AnyEvent[];

  constructor(id: Id, version: number, props: P) {
    super(id, version, props);

    this._events = [];
  }

  _constructor() {
    return this.constructor as StateAggregateClass<typeof this>;
  }

  override props() {
    return super.props()!;
  }

  get version() {
    return this._version;
  }

  events() {
    return Array.from(this._events);
  }

  protected recordEvent<E extends AnyEvent>(event: E): void;
  protected recordEvent<E extends AnyEvent>(
    eventClass: EventClassWithTypedConstructor<E>,
    props: InferredProps<E>,
    options?: NewEventOptions
  ): void;
  protected recordEvent<E extends AnyEvent>(
    p1: E | EventClassWithTypedConstructor<E>,
    p2?: InferredProps<E>,
    p3?: NewEventOptions
  ): void {
    let event: E;

    if (typeof p1 === "function" && p2) {
      event = this.newEvent(p1, p2, p3);
    } else {
      event = p1 as E;
    }

    this._events.push(event);
  }

  clearEvents() {
    this._events = [];
  }

  releaseEvents() {
    const events = this.events();

    this.clearEvents();

    return events;
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
