import { AnyEvent, AnyEventSourcedAggregate, EventApplier, EventClass } from "../../core";
export declare const When: <T extends AnyEvent>(eventClass: EventClass<T, any[]>) => <U extends EventApplier<T>>(target: AnyEventSourcedAggregate, propertyKey: string, descriptor: TypedPropertyDescriptor<U>) => void;
