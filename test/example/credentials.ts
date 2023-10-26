import { Entity } from "#base/entity";
import { TypeEntity } from "src/decorators";

export interface CredentialsProps {
  username: string;
  password: string;
}

@TypeEntity()
export class Credentials extends Entity<CredentialsProps> {
  get username() {
    return this.props.username;
  }

  get password() {
    return this.props.password;
  }

  comparePassword(password: string) {
    return password === this.password;
  }

  validatePassword(password: string) {
    if (!this.comparePassword(password))
      throw new Error("Password does not match");
  }

  validatePasswordToUpdate(password: string) {
    if (this.comparePassword(password))
      throw new Error(
        "Unable to update the password with the same as the current password"
      );
  }

  updatePassword(newPassword: string) {
    this.props.password = newPassword;
  }
}
