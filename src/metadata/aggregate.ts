import {
  AggregateCommandHandler,
  AggregateEventApplier,
  AnyAggregateClass,
} from "#base/aggregate";
import { AnyCommand } from "#base/command";
import { AnyEvent } from "#base/event";
import "reflect-metadata";
import {
  AGGREGATE_COMMANDS_HANDLERS,
  AGGREGATE_EVENTS_APPLIERS,
  AGGREGATE_TYPE,
} from "./constants";
import { AggregateTypeHasNotBeenSetError } from "./errors";
import { Registry } from "./registry";

export const AggregateRegistry = new Registry<AnyAggregateClass>();

// Aggregate Type
export const defineAggregateType = (target: object, aggregateType: string) => {
  Reflect.defineMetadata(AGGREGATE_TYPE, aggregateType, target);
};

export const getAggregateType = (target: object): string => {
  const aggregateType = Reflect.getMetadata(AGGREGATE_TYPE, target);

  if (!aggregateType) throw new AggregateTypeHasNotBeenSetError();

  return aggregateType;
};

// Aggregate Event Applier
export const getAggregateEventAppliersMap = <T extends AnyEvent>(
  target: object
): Map<string, AggregateEventApplier<T>> => {
  return (
    Reflect.getMetadata(AGGREGATE_EVENTS_APPLIERS, target) ||
    new Map<string, AggregateEventApplier<T>>()
  );
};

export const defineAggregateEventApplier = <T extends AnyEvent>(
  target: object,
  eventType: string,
  applier: AggregateEventApplier<T>
) => {
  const eventAppliersMap = getAggregateEventAppliersMap(target);

  eventAppliersMap.set(eventType, applier as AggregateEventApplier<AnyEvent>);

  Reflect.defineMetadata(AGGREGATE_EVENTS_APPLIERS, eventAppliersMap, target);
};

export const getAggregateEventApplier = (
  target: object | null,
  eventType: string
) => {
  if (!target) return null;

  do {
    const eventAppliersMap = getAggregateEventAppliersMap(target);

    const eventApplier = eventAppliersMap.get(eventType);

    if (eventApplier) return eventApplier;
  } while (
    (target = Reflect.getPrototypeOf(target)) &&
    target !== Object.prototype
  );

  return null;
};

// Aggregate Command Handler
export const getAggregateCommandHandlersMap = <T extends AnyCommand>(
  target: object
): Map<string, AggregateCommandHandler<T>> => {
  return (
    Reflect.getMetadata(AGGREGATE_COMMANDS_HANDLERS, target) ||
    new Map<string, AggregateCommandHandler<T>>()
  );
};

export const defineAggregateCommandHandler = <T extends AnyCommand>(
  target: object,
  commandType: string,
  handler: AggregateCommandHandler<T>
) => {
  const commandHandlersMap = getAggregateCommandHandlersMap(target);

  commandHandlersMap.set(
    commandType,
    handler as AggregateCommandHandler<AnyCommand>
  );

  Reflect.defineMetadata(
    AGGREGATE_COMMANDS_HANDLERS,
    commandHandlersMap,
    target
  );
};

export const getAggregateCommandHandler = (
  target: object | null,
  commandType: string
) => {
  if (!target) return null;

  do {
    const commandHandlersMap = getAggregateCommandHandlersMap(target);

    const commandHandler = commandHandlersMap.get(commandType);

    if (commandHandler) return commandHandler;
  } while (
    (target = Reflect.getPrototypeOf(target)) &&
    target !== Object.prototype
  );

  return null;
};
