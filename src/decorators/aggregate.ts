import {
  AggregateClass,
  AggregateESClass,
  CommandHandler,
  EventApplier,
} from "#core/aggregate";
import { AnyCommand, CommandClass } from "#core/command";
import { AnyEvent, EventClass } from "#core/event";
import {
  defineCommandHandler,
  defineEventApplier,
  getModelType,
} from "#core/metadata";
import { AggregateType } from "#core/model-type";
import { model } from "./model";

export const aggregate =
  (name?: string) =>
  <T extends AggregateClass | AggregateESClass>(target: T) => {
    const aggregateType = new AggregateType(name ?? target.name);

    model(aggregateType.value)(target);
  };

export const applyEvent = <T extends AnyEvent>(eventClass: EventClass<T>) => {
  return <U extends EventApplier<T>>(
    target: object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<U>
  ) => {
    if (typeof descriptor.value === "function") {
      const type = getModelType(eventClass.prototype);

      defineEventApplier(target, type, descriptor.value);
    }
  };
};

export const handleCommand = <T extends AnyCommand>(
  commandClass: CommandClass<T>
) => {
  return <U extends CommandHandler<T>>(
    target: object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<U>
  ) => {
    if (typeof descriptor.value === "function") {
      const type = getModelType(commandClass.prototype);

      defineCommandHandler(target, type, descriptor.value);
    }
  };
};
