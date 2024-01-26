import { Event } from "#base/event";
import { TypeEvent } from "src/decorators";
import { Name } from ".";
import { AggregateTypes } from "./type";

export interface PasswordChangedProps {
  password: string;
}

@TypeEvent(AggregateTypes.User, "password_changed")
export class PasswordChangedEvent extends Event<PasswordChangedProps> {}

//
export interface NameChangedEventProps {
  name: Name;
}

@TypeEvent(AggregateTypes.User, "name_changed")
export class NameChangedEvent extends Event<NameChangedEventProps> {}
