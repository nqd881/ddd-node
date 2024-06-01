import {
  AnyEvent,
  AnyEventSourcedAggregate,
  EventApplier,
  EventClass,
} from "../../core";
import { defineEventApplier } from "../../meta";

export const When = <T extends AnyEvent>(eventClass: EventClass<T>) => {
  return <U extends EventApplier<T>>(
    target: AnyEventSourcedAggregate,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<U>
  ) => {
    if (typeof descriptor.value === "function") {
      const eventType = eventClass.eventType();

      defineEventApplier(target, eventType, descriptor.value);
    }
  };
};
