import { AnyCommand, CommandClass, CommandHandler } from "../../core";
import { defineCommandHandler, getModelName } from "../../meta";

export const Handle = <T extends AnyCommand>(commandClass: CommandClass<T>) => {
  return <U extends CommandHandler<T>>(
    target: object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<U>
  ) => {
    if (typeof descriptor.value === "function") {
      const commandName = getModelName(commandClass);

      defineCommandHandler(target, commandName, descriptor.value);
    }
  };
};
