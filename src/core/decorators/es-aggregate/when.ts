import { AnyEvent, AnyESAggregate, EventApplier, EventClass } from "../..";
import { defineOwnEventApplier } from "../../meta";

export const When = <T extends AnyEvent>(eventClass: EventClass<T>) => {
  return <U extends EventApplier<T>>(
    target: AnyESAggregate,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<U>
  ) => {
    if (typeof descriptor.value === "function") {
      const eventType = eventClass.eventType();

      defineOwnEventApplier(target, eventType, descriptor.value);
    }
  };
};
