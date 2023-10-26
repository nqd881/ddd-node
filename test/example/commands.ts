import { Command } from "#base/command";
import { TypeCommand } from "src/decorators";
import { Name } from "./name";

export interface ChangePasswordCommandProps {
  oldPassword: string;
  newPassword: string;
}

@TypeCommand()
export class ChangePasswordCommand extends Command<ChangePasswordCommandProps> {}

//
export interface ChangeNameCommandProps {
  newName: Name;
}

@TypeCommand()
export class ChangeNameCommand extends Command<ChangeNameCommandProps> {}
