import { AnyCommand, CommandClass, CommandType } from "../../core";
import { setCommandType } from "../../meta";

export const Command = (commandType: CommandType) => {
  return <T extends AnyCommand>(target: CommandClass<T>) => {
    setCommandType(target, commandType);
  };
};
