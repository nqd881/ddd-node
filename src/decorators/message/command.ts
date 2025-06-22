import { Model, ModelOptions } from "../../base";
import { AnyCommand, CommandClass } from "../../core";
import { CommandType, defineCommandType } from "../../meta";

export const Command = (
  commandType: CommandType,
  modelOptions?: ModelOptions
) => {
  return <T extends AnyCommand>(target: CommandClass<T>) => {
    defineCommandType(target, commandType);
    Model(modelOptions)(target);
  };
};
