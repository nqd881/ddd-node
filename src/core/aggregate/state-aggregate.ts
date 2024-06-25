import { Class } from "type-fest";
import { ClassStatic } from "../../types";
import { Id } from "../id";
import { AnyEvent, EventClass } from "../message";
import { Props, PropsOf } from "../../model";
import { AggregateBase, AggregateMetadata } from "./base";

export interface IEventDispatcher {
  dispatch(event: AnyEvent): void;
}

export class StateAggregateBase<P extends Props> extends AggregateBase<P> {
  private _events: AnyEvent[];

  constructor(metadata: AggregateMetadata, props: P) {
    super(metadata, props);

    this._events = [];
  }

  static newAggregate<T extends AnyStateAggregate>(
    this: StateAggregateClassWithTypedConstructor<T>,
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

  dispatchEvents(dispatcher: IEventDispatcher) {
    this.events().forEach((event) => {
      dispatcher.dispatch(event);
    });

    this.clearEvents();
  }
}

export type AnyStateAggregate = StateAggregateBase<Props>;

export interface StateAggregateClass<
  T extends AnyStateAggregate = AnyStateAggregate,
  Arguments extends unknown[] = any[]
> extends Class<T, Arguments>,
    ClassStatic<typeof StateAggregateBase<PropsOf<T>>> {}

export interface StateAggregateClassWithTypedConstructor<
  T extends AnyStateAggregate = AnyStateAggregate
> extends StateAggregateClass<
    T,
    ConstructorParameters<typeof StateAggregateBase<PropsOf<T>>>
  > {}
