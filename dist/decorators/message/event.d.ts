import { AnyEvent, EventClass } from "../../core";
import { EventType } from "../../meta";
export declare const Event: (eventType: EventType) => <T extends AnyEvent>(target: EventClass<T, any[]>) => void;
