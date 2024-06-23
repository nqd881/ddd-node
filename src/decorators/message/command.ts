import { AnyCommand, CommandClass } from "../../core";
import { CommandType, defineCommandType } from "../../meta";

export const Command = (commandType: CommandType) => {
  return <T extends AnyCommand>(target: CommandClass<T>) => {
    defineCommandType(target, commandType);
  };
};
