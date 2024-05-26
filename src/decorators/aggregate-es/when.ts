import {
  AnyEvent,
  AnyEventSourcedAggregate,
  EventApplier,
  EventClass,
} from "../../core";
import { defineEventApplier, getModelName } from "../../meta";

export const When = <T extends AnyEvent>(eventClass: EventClass<T>) => {
  return <U extends EventApplier<T>>(
    target: AnyEventSourcedAggregate,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<U>
  ) => {
    if (typeof descriptor.value === "function") {
      const eventName = getModelName(eventClass);

      defineEventApplier(target, eventName, descriptor.value);
    }
  };
};
