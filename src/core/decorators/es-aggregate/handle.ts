import {
  AnyCommand,
  AnyESAggregate,
  CommandClass,
  CommandHandler,
} from "../..";
import { defineOwnCommandHandler } from "../../meta";

export const Handle = <T extends AnyCommand>(commandClass: CommandClass<T>) => {
  return <U extends CommandHandler<T>>(
    target: AnyESAggregate,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<U>
  ) => {
    if (typeof descriptor.value === "function") {
      const commandType = commandClass.commandType();

      defineOwnCommandHandler(target, commandType, descriptor.value);
    }
  };
};
