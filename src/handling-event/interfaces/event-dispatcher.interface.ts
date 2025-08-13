import { AnyEvent } from "../../core";

export interface IEventDispatcher {
  dispatch<T extends AnyEvent = AnyEvent>(event: T): Promise<void>;
}
