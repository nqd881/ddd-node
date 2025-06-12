import { Class } from "type-fest";
import { Props, InferredProps } from "../../../base";
import { ClassStatic } from "../../../types";
import { AnyEvent, EventClassWithTypedConstructor } from "../../message";
import {
  AggregateBase,
  AggregateMetadata,
  IAggregateEventPublisher,
} from "../aggregate-base";
import { StateAggregateBuilder } from ".";

export interface StateAggregateMetadata extends AggregateMetadata {}

export class StateAggregateBase<P extends Props> extends AggregateBase<P> {
  static builder<T extends AnyStateAggregate>(
    this: StateAggregateClass<T>
  ): StateAggregateBuilder<T> {
    return new StateAggregateBuilder(this);
  }

  private _events: AnyEvent[];

  constructor(metadata: StateAggregateMetadata, props: P) {
    super(metadata, props);

    this._events = [];
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

  publishEvents(publisher: IAggregateEventPublisher) {
    publisher.publish(this.events());

    this.clearEvents();
  }
}

export type AnyStateAggregate = StateAggregateBase<Props>;

export interface StateAggregateClass<
  T extends AnyStateAggregate = AnyStateAggregate,
  Arguments extends unknown[] = any[]
> extends Class<T, Arguments>,
    ClassStatic<typeof StateAggregateBase<InferredProps<T>>> {}

export interface StateAggregateClassWithTypedConstructor<
  T extends AnyStateAggregate = AnyStateAggregate
> extends StateAggregateClass<
    T,
    ConstructorParameters<typeof StateAggregateBase<InferredProps<T>>>
  > {}
