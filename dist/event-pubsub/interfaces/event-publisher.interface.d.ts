import { AnyEvent } from "../../core";
export interface IEventPublisher {
    publish<T extends AnyEvent = AnyEvent>(event: T): Promise<void>;
}
