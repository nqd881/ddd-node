import { ValueObject } from "#base/value-object";
import { TypeValueObject } from "src/decorators";

export interface NameProps {
  firstName: string;
  lastName: string;
}

@TypeValueObject()
export class Name extends ValueObject<NameProps> {
  get firstName() {
    return this.props.firstName;
  }

  get lastName() {
    return this.props.lastName;
  }
}
