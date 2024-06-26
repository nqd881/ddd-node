import { ModelBase, Props } from "../../model";
import { Id } from "../id";

export class ModelWithId<P extends Props> extends ModelBase<P> {
  protected readonly _id: Id;

  constructor(id: Id) {
    super();

    this._id = id;
  }

  id() {
    return this._id;
  }

  hasId(id: Id) {
    return this._id.equals(id);
  }
}

export type AnyModelWithId = ModelWithId<Props>;
