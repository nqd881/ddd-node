import { AnyCommand, CommandClass } from "../../core";
import { CommandType, setCommandType } from "../../meta";

export const Command = (commandType: CommandType) => {
  return <T extends AnyCommand>(target: CommandClass<T>) => {
    setCommandType(target, commandType);
  };
};
