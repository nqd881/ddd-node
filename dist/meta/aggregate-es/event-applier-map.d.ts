import "reflect-metadata";
import { AnyEvent, EventApplier } from "../../core";
export declare class EventApplierMap extends Map<string, EventApplier> {
}
export declare const OwnEventApplierMapMetaKey: unique symbol;
export declare const getOwnEventApplierMap: (target: object) => EventApplierMap;
export declare const defineEventApplier: <T extends AnyEvent>(target: object, eventType: string, applier: EventApplier<T>) => void;
export declare const EventApplierMapMetaKey: unique symbol;
export declare const getEventApplierMap: (target: object) => EventApplierMap;
