import { AggregateES } from "#base/aggregate";
import { ApplyEvent, ProcessCommand, TypeAggregate } from "src/decorators";
import {
  ChangeNameCommand,
  ChangePasswordCommand,
  Credentials,
  Name,
  NameChangedEvent,
  PasswordChangedEvent,
} from ".";
import { AggregateTypes } from "./type";

export interface UserProps {
  name: Name;
  credentials: Credentials;
}

@TypeAggregate(AggregateTypes.User)
export class User extends AggregateES<UserProps> {
  get name() {
    return this.props.name;
  }

  get credentials() {
    return this.props.credentials;
  }

  @ProcessCommand(ChangePasswordCommand)
  processChangePassword(command: ChangePasswordCommand) {
    const { oldPassword, newPassword } = command.getProps();

    this.credentials.validatePassword(oldPassword);
    this.credentials.validatePasswordToUpdate(newPassword);

    return this.newEvent(PasswordChangedEvent, {
      password: newPassword,
    });
  }

  @ApplyEvent(PasswordChangedEvent)
  applyPasswordChanged(event: PasswordChangedEvent) {
    const { password } = event.getProps();

    this.credentials.updatePassword(password);
  }

  changePassword(oldPassword: string, newPassword: string) {
    this.processCommand(
      ChangePasswordCommand.newCommand({ oldPassword, newPassword })
    );
  }

  @ProcessCommand(ChangeNameCommand)
  processChangeName(command: ChangeNameCommand) {
    const { newName } = command.getProps();

    return this.newEvent(NameChangedEvent, {
      name: newName,
    });
  }

  @ApplyEvent(NameChangedEvent)
  applyNameChanged(event: NameChangedEvent) {
    const { name } = event.getProps();

    this.props.name = name;
  }

  changeName(name: Name) {
    this.processCommand(ChangeNameCommand.newCommand({ newName: name }));
  }
}
