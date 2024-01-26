import { AnyCommand, CommandClass } from "#base/command";
import { CommandRegistry, defineCommandType } from "#metadata/command";
import { TypeMessage } from "./message";

export const TypeCommand = <T extends AnyCommand>(
  aggregateType: string,
  commandType?: string
) => {
  return <U extends CommandClass<T>>(target: U) => {
    TypeMessage(aggregateType)(target);

    commandType = commandType ?? target.name;

    defineCommandType(target.prototype, commandType);

    CommandRegistry.register(commandType, target);
  };
};
