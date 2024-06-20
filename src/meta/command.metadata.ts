import "reflect-metadata";

export type CommandType = string;

const CommandTypeMetaKey = Symbol.for("COMMAND_TYPE");

export const setCommandType = (target: object, commandType: CommandType) => {
  Reflect.defineMetadata(CommandTypeMetaKey, commandType, target);
};

export const getCommandType = (target: object): CommandType | undefined => {
  return Reflect.getOwnMetadata(CommandTypeMetaKey, target);
};
