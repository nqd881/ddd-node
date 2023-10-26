import { Event } from "#base/event";
import { TypeEvent } from "src/decorators";
import { Name } from "./name";

export interface PasswordChangedProps {
  password: string;
}

@TypeEvent("user.password_changed")
export class PasswordChangedEvent extends Event<PasswordChangedProps> {}

//
export interface NameChangedEventProps {
  name: Name;
}

@TypeEvent("user.name_changed")
export class NameChangedEvent extends Event<NameChangedEventProps> {}
