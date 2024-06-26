import { AnyEvent } from "../message";

export interface IEventDispatcher {
  dispatch(event: AnyEvent): void;
}
