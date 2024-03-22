import { Id, IdGenerator, Uuid4Generator } from "./id";
import { getIdGenerator } from "./metadata";
import { Model } from "./model";

export class ModelWithId<Props extends object> extends Model<Props> {
  static getIdGenerator(this: any): IdGenerator {
    return getIdGenerator(this) || new Uuid4Generator();
  }

  static id(id?: Id) {
    const generator = this.getIdGenerator();

    return id ? generator.fromId(id) : generator.newId();
  }
}
