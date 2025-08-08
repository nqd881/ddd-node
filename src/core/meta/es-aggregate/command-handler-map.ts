import { AnyCommand, CommandHandler } from "../../model";

export class CommandHandlerMap extends Map<string, CommandHandler> {}

export const OwnCommandHandlerMapMetaKey = Symbol.for(
  "OWN_COMMAND_HANDLER_MAP"
);

export const getOwnCommandHandlerMap = (target: object): CommandHandlerMap => {
  const ownCommandHandlerMap = () =>
    Reflect.getOwnMetadata<CommandHandlerMap>(
      OwnCommandHandlerMapMetaKey,
      target
    );

  if (!ownCommandHandlerMap())
    Reflect.defineMetadata(
      OwnCommandHandlerMapMetaKey,
      new CommandHandlerMap(),
      target
    );

  return ownCommandHandlerMap()!;
};

export const defineCommandHandler = <T extends AnyCommand>(
  target: object,
  commandType: string,
  handler: CommandHandler<T>
) => {
  const commandHandlersMap = getOwnCommandHandlerMap(target);

  commandHandlersMap.set(commandType, handler as CommandHandler);
};

export const CommandHandlerMapMetaKey = Symbol.for("COMMAND_HANDLER_MAP");

export const getCommandHandlerMap = (target: object): CommandHandlerMap => {
  if (!Reflect.hasOwnMetadata(CommandHandlerMapMetaKey, target)) {
    const buildCommandHandlerMap = (target: object) => {
      let _target: object | null = target;

      const result: CommandHandlerMap = new CommandHandlerMap();

      const ownCommandHandlerMaps: CommandHandlerMap[] = [];

      do {
        const ownCommandHandlerMap = getOwnCommandHandlerMap(_target);

        ownCommandHandlerMaps.unshift(ownCommandHandlerMap);

        _target = Reflect.getPrototypeOf(_target);
      } while (_target !== null);

      ownCommandHandlerMaps.forEach((ownCommandHandlerMap) => {
        ownCommandHandlerMap.forEach((commandHandler, commandType) => {
          result.set(commandType, commandHandler);
        });
      });

      return result;
    };

    Reflect.defineMetadata(
      CommandHandlerMapMetaKey,
      buildCommandHandlerMap(target),
      target
    );
  }

  return Reflect.getOwnMetadata<CommandHandlerMap>(
    CommandHandlerMapMetaKey,
    target
  )!;
};
