import "reflect-metadata";

export type CommandType = string;

export class $CommandType extends String {
  static validate(commandType: string) {
    if (commandType.trim().length === 0)
      throw new Error("IsCommand type cannot be an empty string");
  }

  constructor(commandType: CommandType) {
    $CommandType.validate(commandType);

    super(commandType);
  }
}

const CommandTypeMetaKey = Symbol.for("COMMAND_TYPE");

export const defineCommandType = (target: object, commandType: CommandType) => {
  Reflect.defineMetadata(
    CommandTypeMetaKey,
    new $CommandType(commandType),
    target
  );
};

export const getCommandType = (target: object): CommandType => {
  const commandType = Reflect.getOwnMetadata<$CommandType>(
    CommandTypeMetaKey,
    target
  );

  if (!commandType) throw new Error("IsCommand's type is not defined");

  return commandType.valueOf();
};
