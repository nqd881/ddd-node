import {
  AggregateClass,
  AggregateCommandHandler,
  AggregateEventApplier,
  AnyAggregate,
} from "#base/aggregate";
import { AnyCommand } from "#base/command";
import { AnyEvent } from "#base/event";
import {
  AggregateRegistry,
  defineAggregateCommandHandler,
  defineAggregateEventApplier,
  defineAggregateType,
} from "#metadata/aggregate";
import { getCommandType } from "#metadata/command";
import { getEventType } from "#metadata/event";
import { Class } from "#types/class";

export const TypeAggregate = <T extends AnyAggregate>(
  aggregateType?: string
) => {
  return <U extends AggregateClass<T>>(target: U) => {
    aggregateType = aggregateType ?? target.name;

    defineAggregateType(target.prototype, aggregateType);

    AggregateRegistry.register(aggregateType, target);
  };
};

export const ApplyEvent = <E extends AnyEvent>(eventClass: Class<E>) => {
  return <T extends AggregateEventApplier<E>>(
    target: object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ) => {
    if (typeof descriptor.value === "function") {
      const eventType = getEventType(eventClass.prototype);

      defineAggregateEventApplier(target, eventType, descriptor.value);
    }
  };
};

export const ProcessCommand = <C extends AnyCommand>(
  commandClass: Class<C>
) => {
  return <T extends AggregateCommandHandler<C>>(
    target: object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ) => {
    if (typeof descriptor.value === "function") {
      const commandType = getCommandType(commandClass.prototype);

      defineAggregateCommandHandler(target, commandType, descriptor.value);
    }
  };
};
