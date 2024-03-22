import { v4, validate, version } from "uuid";
import { Id } from "./id";

export abstract class IdGenerator {
  abstract generateValue(): string;

  abstract validateValue(value: string): void;

  fromValue(value: string) {
    this.validateValue(value);

    return new Id(value);
  }

  fromId(id: Id) {
    return this.fromValue(id.value);
  }

  newId(): Id {
    return this.fromValue(this.generateValue());
  }
}
