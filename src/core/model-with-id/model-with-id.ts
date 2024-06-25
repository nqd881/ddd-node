import { getIdService } from "../../meta";
import { Id } from "../id";
import { ModelBase, Props } from "../../model/core/model";

export class ModelWithId<P extends Props> extends ModelBase<P> {
  protected readonly _id: Id;

  constructor(id: Id) {
    super();

    this._id = id;
  }

  static idService() {
    return getIdService(this);
  }

  static id(id?: Id | string) {
    const idService = this.idService();

    return new Id(id ?? idService.generateValue());
  }

  id() {
    return this._id;
  }

  hasId(id: Id) {
    return this._id.equals(id);
  }
}

export type AnyModelWithId = ModelWithId<Props>;
