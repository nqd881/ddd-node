import { AnyCommand, CommandClass } from "#base/command";
import { CommandRegistry, defineCommandType } from "#metadata/command";

export const TypeCommand = <T extends AnyCommand>(commandType?: string) => {
  return <U extends CommandClass<T>>(target: U) => {
    commandType = commandType ?? target.name;

    defineCommandType(target.prototype, commandType);

    CommandRegistry.register(commandType, target);
  };
};
