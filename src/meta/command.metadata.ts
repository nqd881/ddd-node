import "reflect-metadata";

const CommandTypeMetaKey = Symbol.for("COMMAND_TYPE");

export const setCommandType = (target: object, commandType: string) => {
  Reflect.defineMetadata(CommandTypeMetaKey, commandType, target);
};

export const getCommandType = (target: object): string | undefined => {
  return Reflect.getOwnMetadata(CommandTypeMetaKey, target);
};
