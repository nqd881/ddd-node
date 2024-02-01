import { CommandClass } from "#core/command";
import { CommandType } from "#core/model-type";
import { model } from "./model";

export const command =
  (name?: string) =>
  <T extends CommandClass>(target: T) => {
    const commandType = new CommandType(name ?? target.name);

    model(commandType.value)(target);
  };
