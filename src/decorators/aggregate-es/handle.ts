import {
  AnyCommand,
  AnyEventSourcedAggregate,
  CommandClass,
  CommandHandler,
} from "../../core";
import { defineCommandHandler } from "../../meta";

export const Handle = <T extends AnyCommand>(commandClass: CommandClass<T>) => {
  return <U extends CommandHandler<T>>(
    target: AnyEventSourcedAggregate,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<U>
  ) => {
    if (typeof descriptor.value === "function") {
      const { commandType } = commandClass.commandModelMetadata();

      defineCommandHandler(target, commandType, descriptor.value);
    }
  };
};
