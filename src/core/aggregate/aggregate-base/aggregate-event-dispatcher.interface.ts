import { AnyEvent } from "../../message";

export interface IAggregateEventDispatcher {
  dispatch(event: AnyEvent): void;
}
