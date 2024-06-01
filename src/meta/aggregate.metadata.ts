import { AnyCommand, AnyEvent, CommandHandler, EventApplier } from "../core";
import "reflect-metadata";

// Event applier map

export const EventApplierMapMetaKey = Symbol.for("EVENT_APPLIER_MAP");

export const getEventApplierMap = (
  target: object
): Map<string, EventApplier> => {
  const eventApplierMap = () =>
    Reflect.getMetadata(EventApplierMapMetaKey, target);

  if (eventApplierMap()) return eventApplierMap();

  Reflect.defineMetadata(EventApplierMapMetaKey, new Map(), target);

  return eventApplierMap();
};

export const defineEventApplier = <T extends AnyEvent>(
  target: object,
  eventType: string,
  applier: EventApplier<T>
) => {
  const eventAppliersMap = getEventApplierMap(target);

  eventAppliersMap.set(eventType, applier as EventApplier);
};

// Command handler map

export const CommandHandlerMapMetaKey = Symbol.for("COMMAND_HANDLER_MAP");

export const getCommandHandlerMap = (
  target: object
): Map<string, CommandHandler> => {
  const commandHandlerMap = () =>
    Reflect.getMetadata(CommandHandlerMapMetaKey, target);

  if (commandHandlerMap()) return commandHandlerMap();

  Reflect.defineMetadata(CommandHandlerMapMetaKey, new Map(), target);

  return commandHandlerMap();
};

export const defineCommandHandler = <T extends AnyCommand>(
  target: object,
  commandType: string,
  handler: CommandHandler<T>
) => {
  const commandHandlersMap = getCommandHandlerMap(target);

  commandHandlersMap.set(commandType, handler as CommandHandler);
};
