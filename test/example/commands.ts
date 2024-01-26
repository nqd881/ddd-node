import { Command } from "#base/command";
import { TypeCommand } from "src/decorators";
import { Name } from ".";
import { AggregateTypes } from "./type";

export interface ChangePasswordCommandProps {
  oldPassword: string;
  newPassword: string;
}

@TypeCommand(AggregateTypes.User, "change_password")
export class ChangePasswordCommand extends Command<ChangePasswordCommandProps> {}

//
export interface ChangeNameCommandProps {
  newName: Name;
}

@TypeCommand(AggregateTypes.User, "change_name")
export class ChangeNameCommand extends Command<ChangeNameCommandProps> {}
