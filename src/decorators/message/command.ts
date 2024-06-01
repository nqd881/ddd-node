import { AnyCommand, CommandClass } from "../../core";
import { setCommandType } from "../../meta";

export const Command = (commandType: string) => {
  return <T extends AnyCommand>(target: CommandClass<T>) => {
    setCommandType(target, commandType);
  };
};
