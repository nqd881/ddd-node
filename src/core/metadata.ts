import "reflect-metadata";
import { CommandHandler, EventApplier } from "./aggregate";
import { IdGenerator } from "./id";
import { ModelTypePattern } from "./model";
import { AnyCommand, AnyEvent } from "./message";

// Model type

export const MODEL_TYPE = "MODEL_TYPE";

export const defineModelType = (target: object, type: ModelTypePattern) => {
  Reflect.defineMetadata(MODEL_TYPE, type, target);
};

export const getModelType = (target: object): ModelTypePattern => {
  const type = Reflect.getMetadata(MODEL_TYPE, target);

  if (!type) throw new Error("The type has not been defined");

  return type;
};

// Id generator
export const ID_GENERATOR = "ID_GENERATOR";

export const defineIdGenerator = (target: object, idGenerator: IdGenerator) => {
  Reflect.defineMetadata(ID_GENERATOR, idGenerator, target);
};

export const getIdGenerator = (target: object) => {
  return Reflect.getMetadata(ID_GENERATOR, target);
};

// Event applier map

export const EVENT_APPLIERS = "EVENT_APPLIERS";

export const getEventAppliersMap = (
  target: object
): Map<string, EventApplier> => {
  return (
    Reflect.getMetadata(EVENT_APPLIERS, target) ||
    new Map<string, EventApplier>()
  );
};

export const defineEventApplier = <T extends AnyEvent>(
  target: object,
  eventType: string,
  applier: EventApplier<T>
) => {
  const eventAppliersMap = getEventAppliersMap(target);

  eventAppliersMap.set(eventType, applier as EventApplier);

  Reflect.defineMetadata(EVENT_APPLIERS, eventAppliersMap, target);
};

// Command handler map

export const COMMAND_HANDLERS = "COMMAND_HANDLERS";

export const getCommandHandlersMap = (
  target: object
): Map<string, CommandHandler> => {
  return (
    Reflect.getMetadata(COMMAND_HANDLERS, target) ||
    new Map<string, CommandHandler>()
  );
};

export const defineCommandHandler = <T extends AnyCommand>(
  target: object,
  commandType: string,
  handler: CommandHandler<T>
) => {
  const commandHandlersMap = getCommandHandlersMap(target);

  commandHandlersMap.set(commandType, handler as CommandHandler);

  Reflect.defineMetadata(COMMAND_HANDLERS, commandHandlersMap, target);
};
